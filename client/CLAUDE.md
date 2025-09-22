# TanStack Start Search Component Implementation

## How the Search Component Works

The `Search` component is a refactored version migrated from Next.js to TanStack Start that provides real-time search functionality with URL parameter management.

### Key Components & APIs Used

#### 1. TanStack Router Hooks
```typescript
import { useRouter, useSearch } from "@tanstack/react-router";
```

- **`useSearch({ strict: false })`**: Reads current URL search parameters
  - `strict: false` allows reading any search params without strict typing
  - Returns current search object (e.g., `{ query: "search term", page: "1" }`)

- **`useRouter()`**: Provides access to router instance
  - Used for `router.invalidate()` to trigger re-renders when URL changes
  - More flexible than `useNavigate()` for complex routing operations

#### 2. Debounced Input Handling
```typescript
import { useDebouncedCallback } from "use-debounce";
```

- **`useDebouncedCallback(callback, delay)`**: Prevents excessive API calls
  - Delays execution by 300ms after user stops typing
  - Improves performance by reducing unnecessary search requests

#### 3. URL Manipulation Strategy

Instead of using TanStack Router's complex typing system, we use native browser APIs:

```typescript
const currentUrl = new URL(window.location.href);
currentUrl.searchParams.set("page", "1");

if (term) {
  currentUrl.searchParams.set("query", term);
} else {
  currentUrl.searchParams.delete("query");
}

window.history.replaceState(null, "", currentUrl.toString());
router.invalidate();
```

**Why this approach?**
- **Avoids TypeScript complexity**: TanStack Router has strict typing that's difficult to work with
- **Direct browser API**: Uses standard `URLSearchParams` and `history.replaceState()`
- **Router integration**: `router.invalidate()` tells TanStack Router to re-read the URL
- **Clean URL updates**: `replaceState` updates URL without adding history entries

#### 4. Component Flow

1. **User types** in the input field
2. **Debounce waits** 300ms for user to stop typing
3. **URL is constructed** with new search parameters
4. **Browser history updates** with `replaceState()`
5. **Router invalidates** to trigger component re-renders
6. **Search params propagate** to other components via URL

### Migration Changes from Next.js

| Next.js | TanStack Start |
|---------|----------------|
| `useSearchParams()` | `useSearch({ strict: false })` |
| `useRouter().replace()` | `window.history.replaceState()` + `router.invalidate()` |
| `usePathname()` | Not needed (using full URL) |

### Benefits of This Implementation

- ✅ **URL-driven state**: Search state persists in URL (shareable, bookmarkable)
- ✅ **Performance optimized**: Debounced to prevent excessive calls
- ✅ **Type-safe where needed**: Only minimal type assertions where necessary
- ✅ **Browser compatible**: Uses standard web APIs
- ✅ **Router integrated**: Properly syncs with TanStack Router system

This pattern can be reused for any URL-based state management in TanStack Start applications.

---

## TanStack Start Pagination Component Implementation

The `PaginationComponent` is a migrated version from Next.js to TanStack Start that provides URL-based pagination functionality with previous/next navigation.

### Key Components & APIs Used

#### 1. TanStack Router Integration
```typescript
import { useRouter, useSearch } from "@tanstack/react-router";
```

- **`useSearch({ strict: false })`**: Reads current page from URL parameters
  - `strict: false` allows reading any search params without strict typing
  - Extracts page number: `Number((search as any)?.page) || 1`

- **`useRouter()`**: Provides router instance for invalidation
  - Used with `router.invalidate()` to trigger re-renders after URL changes

#### 2. Navigation Button Component
```typescript
interface PaginationArrowProps {
  direction: "left" | "right";
  pageNumber: number;
  isDisabled: boolean;
}
```

**PaginationArrow Features:**
- **Visual styling**: Previous button (secondary), Next button (primary) using theme colors
- **Theme system integration**: Uses CSS custom properties for automatic light/dark adaptation
- **Disabled state handling**: Prevents navigation beyond valid page range
- **Click handler**: Updates URL and invalidates router

#### 3. URL-Based Page Navigation

Instead of href-based navigation, uses direct URL manipulation:

```typescript
const handleClick = () => {
  if (isDisabled) return;

  const currentUrl = new URL(window.location.href);
  currentUrl.searchParams.set("page", pageNumber.toString());

  window.history.replaceState(null, "", currentUrl.toString());
  router.invalidate();
};
```

**Why this approach?**
- **Preserves other URL params**: Maintains search queries, filters, etc.
- **Immediate URL updates**: Uses `replaceState()` for clean navigation
- **Router sync**: `router.invalidate()` ensures TanStack Router responds to changes
- **Type safety**: Avoids complex TanStack Router typing requirements

#### 3a. Theme System Integration

The component uses the project's CSS custom property theme system for automatic light/dark adaptation:

```typescript
// Previous button (left arrow) - secondary theme colors
// Next button (right arrow) - primary theme colors
const buttonClassName = isLeft
  ? `bg-secondary text-secondary-foreground hover:bg-secondary/80 ${disabledClassName}`
  : `bg-primary text-primary-foreground hover:bg-primary/90 ${disabledClassName}`;

// Page display text using primary theme color
<span className="p-2 font-semibold text-primary">
  Page {currentPage}
</span>
```

**Theme Integration Features:**
- **Previous button**: Uses `secondary` theme colors for subtle appearance
- **Next button**: Uses `primary` theme colors for prominence and call-to-action
- **Page text**: Uses `primary` color for consistency with theme
- **Automatic adaptation**: CSS custom properties handle light/dark mode switching
- **Hover states**: Uses opacity modifiers (`/80`, `/90`) for consistent hover effects

#### 4. Component Structure

```typescript
export function PaginationComponent({ pageCount, className }: PaginationProps) {
  const search = useSearch({ strict: false });
  const currentPage = Number((search as any)?.page) || 1;

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous Button */}
        <PaginationArrow
          direction="left"
          pageNumber={currentPage - 1}
          isDisabled={currentPage <= 1}
        />

        {/* Page Display */}
        <span className="p-2 font-semibold text-primary">
          Page {currentPage}
        </span>

        {/* Next Button */}
        <PaginationArrow
          direction="right"
          pageNumber={currentPage + 1}
          isDisabled={currentPage >= pageCount}
        />
      </PaginationContent>
    </Pagination>
  );
}
```

### Migration Changes from Next.js

| Next.js | TanStack Start |
|---------|----------------|
| `useSearchParams().get("page")` | `(search as any)?.page` |
| `usePathname()` + `URLSearchParams` | `new URL(window.location.href)` |
| `router.push(href)` | `window.history.replaceState()` + `router.invalidate()` |
| `href` prop on arrows | `pageNumber` prop + click handler |

### Component Flow

1. **Component mounts** and reads current page from URL via `useSearch()`
2. **User clicks arrow** button (previous/next)
3. **Click handler executes**:
   - Checks if navigation is disabled
   - Creates new URL with updated page parameter
   - Updates browser history with `replaceState()`
   - Calls `router.invalidate()` to trigger re-render
4. **Component re-renders** with new page number
5. **Other components** (like data loaders) respond to URL change

### Benefits of This Implementation

- ✅ **URL-driven pagination**: Page state persists in URL (shareable, bookmarkable)
- ✅ **Preserves other params**: Maintains search queries when paginating
- ✅ **Visual feedback**: Disabled states and distinct button styling
- ✅ **Theme system integration**: Uses CSS custom properties for automatic light/dark adaptation
- ✅ **Accessible**: Proper ARIA attributes and disabled states
- ✅ **Router integrated**: Syncs with TanStack Router's reactive system

### Usage Example

```typescript
// In a route component
<PaginationComponent
  pageCount={totalPages}
  className="mt-4"
/>
```

The component automatically reads the current page from the URL and provides navigation to adjacent pages while maintaining all other URL parameters.

---

## TanStack Start Auth Routes with Shared Layout Using Route Groups

This section demonstrates how to create authentication routes (`/signin` and `/signup`) that share a common layout using TanStack Router's **route groups**. Route groups allow you to share layouts without affecting the URL structure.

### File Structure

```
src/routes/
├── _auth.tsx             # Layout route (underscore = private/layout route)
├── _auth/
│   ├── signin.tsx        # Sign-in page → /signin
│   └── signup.tsx        # Sign-up page → /signup
```

### How Layout Routes Work

1. **Layout Route (`_auth.tsx`)**: Underscore prefix creates a layout route that shares layout but doesn't appear in URLs
2. **Child Routes (`_auth/signin.tsx`, `_auth/signup.tsx`)**: Inherit the layout from the parent layout route
3. **URL Structure**:
   - `/signin` → Layout route + SignIn component
   - `/signup` → Layout route + SignUp component

**Key Benefit**: Clean URLs (`/signin`, `/signup`) while maintaining shared layout!

### Key Implementation Details

#### 1. Layout Route Structure
```typescript
// src/routes/_auth.tsx
import { createFileRoute, Outlet } from '@tanstack/react-router'

function AuthLayout() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Shared header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome</h1>
          <p className="text-muted-foreground">Sign in to your account or create a new one</p>
        </div>

        {/* Child routes render here */}
        <div className="bg-card border border-border rounded-lg shadow-lg p-6">
          <Outlet />
        </div>

        {/* Shared footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
})
```

#### 2. Child Route Structure
```typescript
// src/routes/_auth/signin.tsx
import { createFileRoute, Link } from '@tanstack/react-router'

function SignIn() {
  // Component implementation
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-card-foreground">Sign In</h2>
      {/* Form and other UI */}
      <Link to="/signup" className="text-primary hover:text-primary/80">
        Sign up
      </Link>
    </div>
  )
}

export const Route = createFileRoute('/_auth/signin')({
  component: SignIn,
})
```

### Benefits of This Approach

- ✅ **Shared Layout**: Common UI elements (header, styling, footer) defined once
- ✅ **Automatic Inheritance**: Child routes automatically get the layout without explicit wrapping
- ✅ **Navigation**: Easy switching between signin/signup with `Link` components
- ✅ **URL Structure**: Clean, predictable URLs (`/auth/signin`, `/auth/signup`)
- ✅ **Theme Integration**: Uses design system colors and components
- ✅ **Responsive**: Mobile-friendly with proper spacing and sizing

### Navigation Between Auth Pages

Use TanStack Router's `Link` component for navigation:

```typescript
// In signin page - link to signup
<Link to="/signup" className="text-primary hover:text-primary/80">
  Sign up
</Link>

// In signup page - link to signin
<Link to="/signin" className="text-primary hover:text-primary/80">
  Sign in
</Link>
```

### Adding More Auth Routes

To add additional auth routes (e.g., forgot password, reset password):

1. Create new route file: `src/routes/_auth/forgot-password.tsx`
2. Follow the same pattern as signin/signup routes
3. The layout will automatically apply

```typescript
// src/routes/_auth/forgot-password.tsx
export const Route = createFileRoute('/_auth/forgot-password')({
  component: ForgotPassword,
})
// This creates the URL: /forgot-password
```

This pattern scales well for any number of auth-related pages while maintaining consistent UI and UX.

---

## TanStack Form Implementation with Zod Validation in Auth Components

The auth forms use **TanStack Form** with **Zod validation schemas** for advanced form handling, validation, and state management. This provides a more robust and type-safe approach compared to manual state management.

### Key Benefits of TanStack Form + Zod

- ✅ **Type-safe**: Full TypeScript support with Zod-inferred types
- ✅ **Schema-based validation**: Centralized validation logic with Zod schemas
- ✅ **Real-time validation**: Validates on change/blur with immediate feedback
- ✅ **Smart submit handling**: Automatic form submission state management
- ✅ **Cross-field validation**: Password confirmation validates against password field
- ✅ **Optimized re-renders**: Only re-renders components that need updates

### Zod Schema Setup Pattern

```typescript
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'

// Define Zod schema with validation rules
const signupSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

// Infer TypeScript type from Zod schema
type FormData = z.infer<typeof signupSchema>

function SignUp() {
  const form = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    } as FormData,
    // Use Zod schema for validation
    validators: {
      onChange: signupSchema,
    },
    onSubmit: async ({ value }) => {
      // Handle form submission
      console.log('Form data:', value)
    },
  })

  // Destructure for cleaner code
  const { Field, handleSubmit, state } = form

  // Form JSX...
}
```

### Zod Schema Validation Examples

#### 1. Simple Field Validation (SignIn Form)
```typescript
const signinSchema = z.object({
  identifier: z.string().min(1, 'Username or email is required'),
  password: z.string().min(1, 'Password is required'),
})

// Usage in form
<Field name="identifier">
  {(field) => (
    <div className="space-y-2">
      <label htmlFor="identifier">Username or Email</label>
      <Input
        id="identifier"
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        className={cn(field.state.meta.errors.length > 0 && "border-destructive")}
      />
      {field.state.meta.errors.length > 0 && (
        <p className="text-xs text-destructive">
          {typeof field.state.meta.errors[0] === 'string'
            ? field.state.meta.errors[0]
            : field.state.meta.errors[0]?.message || 'Validation error'}
        </p>
      )}
    </div>
  )}
</Field>
```

#### 2. Complex Validation with Email Format
```typescript
const signupSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
})
```

#### 3. Cross-Field Validation with `.refine()`
```typescript
const signupSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'], // Error appears on confirmPassword field
})
```

### Form Submission Handling

```typescript
<form
  onSubmit={(e) => {
    e.preventDefault()
    e.stopPropagation()
    handleSubmit() // Destructured from form
  }}
  className="space-y-4"
>
  {/* Form fields */}

  <Button
    type="submit"
    className="w-full"
    disabled={state.isSubmitting || !state.canSubmit} // Destructured from form
  >
    {state.isSubmitting ? 'Creating account...' : 'Create Account'}
  </Button>
</form>
```

### Form State Management

TanStack Form provides several useful state properties:

- **`state.isSubmitting`**: True during form submission (destructured from form)
- **`state.canSubmit`**: True when form is valid and can be submitted (destructured from form)
- **`field.state.value`**: Current field value
- **`field.state.meta.errors`**: Array of validation errors for the field
- **`field.handleChange()`**: Updates field value
- **`field.handleBlur()`**: Handles field blur events
- **`handleSubmit()`**: Form submission handler (destructured from form)

### Integration with UI Components

The forms integrate seamlessly with the design system:

```typescript
// Error styling
className={cn(field.state.meta.errors.length > 0 && "border-destructive")}

// Loading states
disabled={state.isSubmitting}

// Submit button state
disabled={state.isSubmitting || !state.canSubmit}

// Error message handling for Zod validation
{field.state.meta.errors.length > 0 && (
  <p className="text-xs text-destructive">
    {typeof field.state.meta.errors[0] === 'string'
      ? field.state.meta.errors[0]
      : field.state.meta.errors[0]?.message || 'Validation error'}
  </p>
)}
```

### Why TanStack Form + Zod vs Manual State?

| Manual State | TanStack Form + Zod |
|--------------|---------------------|
| Manual validation logic | Schema-based validation with Zod |
| Custom error handling | Automatic error state management |
| Form submission boilerplate | Built-in submission handling |
| Manual field updates | Optimized field updates |
| Complex cross-field validation | Simple cross-field validation with `.refine()` |
| TypeScript interfaces | Type inference from Zod schemas |
| Scattered validation rules | Centralized validation schemas |

### Key Advantages of Zod Integration

- ✅ **Schema-first approach**: Define validation once, use everywhere
- ✅ **Type inference**: TypeScript types automatically generated from schemas
- ✅ **Runtime validation**: Validates data at runtime, not just compile time
- ✅ **Reusable schemas**: Can be used for API validation, database schemas, etc.
- ✅ **Better error messages**: Descriptive validation messages built into schema
- ✅ **Cross-field validation**: Easy with `.refine()` method

This approach provides a more maintainable, type-safe, and feature-rich form handling experience while maintaining clean integration with the existing design system.

---

## Reference Documentation

**Note for Claude:** When working on TanStack Start features, use WebFetch to consult these references if needed for implementation details or best practices.

### TanStack Router
- **Search Parameters:** https://tanstack.com/router/latest/docs/framework/react/guide/search-params
- **Data Loading:** https://tanstack.com/router/latest/docs/framework/react/guide/data-loading