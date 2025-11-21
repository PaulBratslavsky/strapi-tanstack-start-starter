# Authentication System

This document explains how authentication works in the TanStack Start + Strapi application, including login flow, session management, JWT validation, and security best practices.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Login Flow](#login-flow)
- [Session Management](#session-management)
- [User Validation with getAuth()](#user-validation-with-getauth)
- [Caching Strategy](#caching-strategy)
- [Security Features](#security-features)
- [Usage Examples](#usage-examples)
- [Protected Operations](#protected-operations)

---

## Architecture Overview

The authentication system uses a **hybrid approach** combining:

1. **HTTP-only session cookies** for secure client-side session storage
2. **JWT tokens** issued by Strapi for API authentication
3. **Server-side validation** against Strapi's `/users/me` endpoint
4. **In-memory caching** to reduce Strapi load

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Client    │────────▶│  TanStack    │────────▶│   Strapi    │
│  (Browser)  │         │    Start     │         │   Backend   │
└─────────────┘         └──────────────┘         └─────────────┘
       │                       │                        │
       │  1. Login Request     │                        │
       │──────────────────────▶│                        │
       │                       │  2. Validate Creds    │
       │                       │───────────────────────▶│
       │                       │                        │
       │                       │  3. Return JWT + User  │
       │                       │◀───────────────────────│
       │                       │                        │
       │  4. Set HTTP-only     │                        │
       │     Cookie (JWT)      │                        │
       │◀──────────────────────│                        │
       │                       │                        │
       │  5. Subsequent Req    │                        │
       │──────────────────────▶│                        │
       │                       │  6. Validate JWT      │
       │                       │───────────────────────▶│
       │                       │     (cached 2 min)     │
       │                       │                        │
```

**Key Files:**
- `src/lib/session.ts` - Session management and validation
- `src/data/server-functions/auth.ts` - Auth server functions
- `src/data/strapi-sdk.ts` - Strapi SDK helpers
- `src/lib/services/auth.ts` - Auth service layer

---

## Login Flow

### 1. User Submits Credentials

When a user logs in via the sign-in form:

```typescript
// src/routes/_auth/signin.tsx
const handleSubmit = async () => {
  const formData = new FormData()
  formData.append('identifier', values.identifier)
  formData.append('password', values.password)

  await loginUserServerFunction({ data: formData })
}
```

### 2. Server Function Validates Credentials

```typescript
// src/data/server-functions/auth.ts
export const loginUserServerFunction = createServerFn({
  method: 'POST',
}).handler(async ({ data: fields }) => {
  // 1. Validate form data with Zod
  const validatedFields = SigninFormSchema.safeParse(fields)

  // 2. Call Strapi auth endpoint
  const responseData = await loginUserService(validatedFields.data)

  // 3. Set HTTP-only cookie session
  const session = await useAppSession()
  await session.update({
    userId: responseData.user.id,
    email: responseData.user.email,
    username: responseData.user.username,
    jwt: responseData.jwt, // Store JWT in secure cookie
  })

  return { success: true }
})
```

### 3. Strapi Returns JWT + User Data

```typescript
// src/lib/services/auth.ts
export async function loginUserService(userData: TLoginUser) {
  const url = new URL("/api/auth/local", baseUrl)

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  })

  // Returns: { jwt: "token...", user: { id, email, username, ... } }
  return response.json()
}
```

### 4. Session Cookie is Set

The session is stored in an **HTTP-only cookie** with the following configuration:

```typescript
// src/lib/session.ts
export function useAppSession() {
  return useSession<SessionData>({
    name: 'auth-session',
    password: process.env.SESSION_SECRET,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
      sameSite: 'lax',                                // CSRF protection
      httpOnly: true,                                 // No JS access
      maxAge: 60 * 60 * 24 * 7,                      // 7 days
    },
  })
}
```

**Security Features:**
- ✅ `httpOnly: true` - Prevents XSS attacks (JS cannot access)
- ✅ `secure: true` - HTTPS only in production
- ✅ `sameSite: 'lax'` - CSRF protection
- ✅ Encrypted with `SESSION_SECRET`

---

## Session Management

### Session Data Structure

```typescript
type SessionData = {
  userId?: number      // Strapi user ID
  email?: string       // User email
  username?: string    // Username
  jwt?: string         // JWT token from Strapi
}
```

### Reading Session Data

```typescript
// In any server function
const session = await useAppSession()

if (session.data.jwt) {
  // User has a session
  console.log(session.data.userId)
  console.log(session.data.email)
}
```

### Clearing Session (Logout)

```typescript
// src/data/server-functions/auth.ts
export const logoutUserServerFunction = createServerFn({
  method: 'POST',
}).handler(async () => {
  const session = await useAppSession()
  await session.clear()

  return { success: true }
})
```

---

## User Validation with getAuth()

### The Problem with Session-Only Auth

**Session cookies alone are NOT secure enough!**

```typescript
// ❌ INSECURE - Only checks if cookie exists
const session = await useAppSession()
if (session.data.jwt) {
  // What if the JWT expired?
  // What if the user was banned in Strapi?
  // What if the token was revoked?
  return "User is authenticated" // WRONG!
}
```

### The Solution: getAuth()

The `getAuth()` function validates the JWT against Strapi on every auth check:

```typescript
// ✅ SECURE - Validates with Strapi
const user = await getAuth()

if (!user) {
  // JWT is invalid, expired, or user was banned
  // Session is automatically cleared
  throw redirect({ to: '/signin' })
}

// User is authenticated and authorized
return user
```

### How getAuth() Works

```typescript
// src/lib/session.ts
export async function getAuth(): Promise<TAuthUser | null> {
  'use server'

  const session = await useAppSession()
  const jwt = session.data.jwt

  // No JWT = not logged in
  if (!jwt) return null

  // Check 2-minute cache first
  const cached = authCache.get(jwt)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.user
  }

  // Validate with Strapi's /users/me endpoint
  try {
    const { getUserMe } = await import('@/data/strapi-sdk')
    const user = await getUserMe(jwt)

    // Cache validated user
    authCache.set(jwt, { user, timestamp: Date.now() })

    // Update session with latest data
    await session.update({
      ...session.data,
      userId: user.id,
      email: user.email,
      username: user.username,
    })

    return user

  } catch (error) {
    // JWT is invalid or expired
    console.error('Auth validation error:', error)

    // Clear session and cache
    authCache.delete(jwt)
    await session.clear()
    return null
  }
}
```

### Strapi SDK Integration

```typescript
// src/data/strapi-sdk.ts
export const getUserMe = async (jwt: string): Promise<TAuthUser> => {
  const authenticatedSdk = strapi({
    baseURL: BASE_API_URL,
    auth: jwt, // Pass JWT for authentication
  })

  const response = await authenticatedSdk.fetch('/users/me')

  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.statusText}`)
  }

  return response.json()
}
```

---

## Caching Strategy

### Why Caching?

Without caching, every protected operation would hit Strapi's `/users/me` endpoint:

- **Problem**: High load on Strapi backend
- **Problem**: Slower response times
- **Problem**: Potential rate limiting

### 5-Minute Cache Implementation

```typescript
// In-memory cache (lives in Node.js process)
const authCache = new Map<string, { user: TAuthUser; timestamp: number }>()
const CACHE_TTL = 2 * 60 * 1000 // 2 minutes
```

### Cache Flow

```
Request 1 (t=0s):
  ├─ No cache
  ├─ Validate with Strapi (/users/me)
  ├─ Store in cache
  └─ Return user

Request 2 (t=30s):
  ├─ Cache HIT (within 2 min)
  ├─ Skip Strapi validation
  └─ Return cached user (FAST!)

Request 3 (t=3m):
  ├─ Cache EXPIRED
  ├─ Validate with Strapi (/users/me)
  ├─ Update cache
  └─ Return fresh user
```

### Cache Invalidation

The cache is automatically cleared when:

1. **JWT validation fails** - Token expired or invalid
2. **User logs out** - `clearAuth()` is called
3. **Session is cleared** - Session cookie removed

```typescript
// Manual cache clear on logout
export async function clearAuth(): Promise<void> {
  'use server'

  const session = await useAppSession()
  const jwt = session.data.jwt

  if (jwt) {
    authCache.delete(jwt) // Clear cache
  }

  await session.clear() // Clear session
}
```

---

## Security Features

### Protection Against Common Attacks

| Attack Vector | Protection Mechanism |
|--------------|---------------------|
| **XSS (Cross-Site Scripting)** | `httpOnly: true` cookie - JS cannot access JWT |
| **CSRF (Cross-Site Request Forgery)** | `sameSite: 'lax'` cookie policy |
| **Session Hijacking** | JWT validation with Strapi on every auth check |
| **Token Theft** | Even with stolen cookie, JWT must be valid in Strapi |
| **Expired Tokens** | `getAuth()` validates expiration with Strapi |
| **Revoked Tokens** | `getAuth()` checks if user still exists/has access |
| **Deleted/Banned Users** | `getAuth()` fails if user deleted or banned |
| **Man-in-the-Middle** | `secure: true` forces HTTPS in production |

### Defense in Depth

The system uses **multiple layers of security**:

```
Layer 1: HTTP-only Cookie
  └─ Prevents client-side JS from accessing JWT

Layer 2: Session Encryption
  └─ Cookie encrypted with SESSION_SECRET

Layer 3: JWT Validation
  └─ Every auth check validates JWT with Strapi

Layer 4: Strapi Authorization
  └─ Strapi enforces permissions and roles

Layer 5: 5-Minute Cache
  └─ Balances security and performance
```

---

## Usage Examples

### Example 1: Protected Route

```typescript
// src/routes/profile.tsx
import { createFileRoute, redirect } from '@tanstack/react-router'
import { getAuth } from '@/lib/session'

export const Route = createFileRoute('/profile')({
  loader: async () => {
    const user = await getAuth()

    if (!user) {
      // Not authenticated - redirect to sign in
      throw redirect({ to: '/signin' })
    }

    // User is authenticated and validated
    return { user }
  },
  component: ProfilePage,
})

function ProfilePage() {
  const { user } = Route.useLoaderData()

  return (
    <div>
      <h1>Welcome, {user.username}!</h1>
      <p>Email: {user.email}</p>
    </div>
  )
}
```

### Example 2: Conditional UI

```typescript
// src/components/navigation.tsx
import { getAuth } from '@/lib/session'

export async function Navigation() {
  const user = await getAuth()

  return (
    <nav>
      <Link to="/">Home</Link>

      {user ? (
        <>
          <Link to="/profile">Profile</Link>
          <span>Welcome, {user.username}</span>
          <LogoutButton />
        </>
      ) : (
        <>
          <Link to="/signin">Sign In</Link>
          <Link to="/signup">Sign Up</Link>
        </>
      )}
    </nav>
  )
}
```

### Example 3: API Route Protection

```typescript
// src/routes/api/user-data.ts
export const getUserData = createServerFn({
  method: 'GET',
}).handler(async () => {
  const user = await getAuth()

  if (!user) {
    return { error: 'Unauthorized', status: 401 }
  }

  // Fetch user-specific data
  const data = await fetchUserData(user.id)

  return { data }
})
```

---

## Protected Operations

### Comment System Security

All comment operations (create, update, delete) validate authentication:

```typescript
// src/data/server-functions/comments.ts

export const createComment = createServerFn({
  method: 'POST',
}).handler(async ({ data: commentData }) => {
  // Validate JWT with Strapi
  const user = await getAuth()

  if (!user) {
    return { error: 'Authentication required' }
  }

  // Get validated JWT from session
  const session = await useAppSession()

  // Create comment with authenticated request
  const response = await createCommentInternal(
    commentData,
    session.data.jwt!
  )

  return response
})
```

### Before vs After Security Improvement

#### Before (INSECURE) ❌

```typescript
// Only checked if session cookie exists
const session = await useAppSession()

if (!session.data.jwt || !session.data.userId) {
  return { error: 'Authentication required' }
}

// PROBLEM: JWT could be expired, invalid, or user banned!
await createComment(session.data.jwt)
```

#### After (SECURE) ✅

```typescript
// Validates JWT with Strapi before allowing operation
const user = await getAuth()

if (!user) {
  // JWT is invalid, expired, or user banned
  // Session automatically cleared
  return { error: 'Authentication required' }
}

// User is verified and authorized
const session = await useAppSession()
await createComment(session.data.jwt!) // Safe to use
```

### Protected Server Functions

All authenticated operations use `getAuth()`:

- ✅ `createComment()` - Create new comment
- ✅ `updateComment()` - Update existing comment
- ✅ `deleteComment()` - Delete comment
- ✅ Any future authenticated operations

---

## Best Practices

### ✅ DO

1. **Always use `getAuth()` for protected routes**
   ```typescript
   const user = await getAuth()
   if (!user) throw redirect({ to: '/signin' })
   ```

2. **Trust `getAuth()` validation**
   ```typescript
   const user = await getAuth()
   // If user exists, JWT is valid and verified
   ```

3. **Use session for JWT storage only**
   ```typescript
   const session = await useAppSession()
   const jwt = session.data.jwt // Use for API calls
   ```

4. **Let `getAuth()` handle session cleanup**
   ```typescript
   // getAuth() automatically clears invalid sessions
   const user = await getAuth()
   ```

### ❌ DON'T

1. **Don't trust session data alone**
   ```typescript
   // ❌ INSECURE
   if (session.data.userId) {
     // User could be banned or token expired!
   }
   ```

2. **Don't bypass getAuth() for performance**
   ```typescript
   // ❌ BAD - Cache is already optimized
   if (session.data.jwt) {
     // Should use getAuth() instead
   }
   ```

3. **Don't manually clear cache**
   ```typescript
   // ❌ NOT NEEDED - getAuth() handles this
   authCache.delete(jwt)
   ```

4. **Don't store sensitive data in session**
   ```typescript
   // ❌ BAD - Session is for JWT only
   session.data.creditCard = "4242..."
   ```

---

## Environment Variables

### Required Variables

```bash
# .env
SESSION_SECRET=your-32-character-secret-key-here-change-in-production
NODE_ENV=production
```

### SESSION_SECRET

- **Purpose**: Encrypts session cookies
- **Requirements**: 32+ characters, random, secure
- **Generation**: Use a password generator or `openssl rand -base64 32`
- **Security**: Never commit to git, use environment variables

---

## Troubleshooting

### Issue: "Authentication required" on every request

**Cause**: Cache is not working or JWT is invalid

**Solution**:
```typescript
// Check if JWT is being set
const session = await useAppSession()
console.log('JWT:', session.data.jwt)

// Check if Strapi is reachable
const user = await getAuth()
console.log('User:', user)
```

### Issue: User stays logged in after ban

**Cause**: Cache TTL hasn't expired

**Solution**:
- Cache expires after 2 minutes
- User will be automatically logged out on next auth check
- To force immediate logout, reduce `CACHE_TTL` in `session.ts`

### Issue: Too many Strapi requests

**Cause**: Cache is not working

**Solution**:
```typescript
// Verify cache is enabled
console.log('Cache TTL:', CACHE_TTL) // Should be 120000 (2 min)
console.log('Cache size:', authCache.size)
```

---

## Summary

The authentication system provides:

✅ **Secure session management** with HTTP-only cookies
✅ **JWT validation** against Strapi on every auth check
✅ **2-minute caching** to balance security and performance
✅ **Automatic session cleanup** for invalid tokens
✅ **Protection against** XSS, CSRF, session hijacking, and token theft
✅ **Strapi SDK integration** for consistent API calls

**Key Takeaway**: Always use `getAuth()` for protected operations. Session cookies are convenient, but JWT validation with Strapi is the source of truth.
