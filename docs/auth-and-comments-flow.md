# Authentication, Redirects, and Comments Flow

This document provides a comprehensive overview of how authentication, redirects, and comments work in the TanStack Start + Strapi application.

## Table of Contents
- [Authentication Flow](#authentication-flow)
- [Redirect Logic](#redirect-logic)
- [Comment System Flow](#comment-system-flow)

---

## Authentication Flow

### Login/Registration Flow

```mermaid
flowchart TD
    Start([User visits sign-in/sign-up page]) --> FormFill[User fills form]
    FormFill --> ClientValidate{Client-side validation}
    ClientValidate -->|Invalid| ShowError1[Show validation errors]
    ClientValidate -->|Valid| ServerFunc[Call server function]

    ServerFunc --> ServerValidate{Server validates with Zod}
    ServerValidate -->|Invalid| ReturnError1[Return validation error]
    ServerValidate -->|Valid| StrapiAuth[POST to Strapi /api/auth/local or /register]

    StrapiAuth --> StrapiCheck{Credentials valid?}
    StrapiCheck -->|No| ReturnError2[Return auth error]
    StrapiCheck -->|Yes| JWTReturn[Strapi returns JWT + user data]

    JWTReturn --> CreateSession[Create session cookie with JWT, userId, email, username]
    CreateSession --> SessionStore[Store in HTTP-only encrypted cookie]
    SessionStore --> Invalidate[router.invalidate - refresh all loaders]
    Invalidate --> Redirect[router.navigate to home '/']
    Redirect --> RootLoader[Root loader validates session]
    RootLoader --> UIUpdate[UI updates - show logged in user]

    ShowError1 --> FormFill
    ReturnError1 --> ShowError1
    ReturnError2 --> ShowError1
```

### OAuth (Social Login) Flow

```mermaid
flowchart TD
    Start([User clicks GitHub/Google button]) --> RedirectProvider[Redirect to /api/connect/provider on Strapi]
    RedirectProvider --> OAuthScreen[Provider OAuth screen]
    OAuthScreen --> UserAuth{User authorizes?}

    UserAuth -->|No| Cancel[Return to app]
    UserAuth -->|Yes| ProviderCallback[Provider redirects with access_token]

    ProviderCallback --> TanStackRoute[TanStack route: /api/connect/$provider/redirect]
    TanStackRoute --> StrapiCallback[POST to /api/auth/provider/callback with token]

    StrapiCallback --> ValidateToken{Strapi validates token with provider}
    ValidateToken -->|Invalid| Error[Return error]
    ValidateToken -->|Valid| CreateUser[Create/find user in Strapi]

    CreateUser --> ReturnJWT[Return JWT + user data]
    ReturnJWT --> CreateSession[Create session with JWT]
    CreateSession --> StoreSession[Store in HTTP-only cookie]
    StoreSession --> Redirect302[HTTP 302 redirect to home '/']
    Redirect302 --> RootLoader[Root loader validates session]
    RootLoader --> LoggedIn[User logged in]

    Error --> Cancel
```

### JWT Validation Flow (useMe endpoint)

```mermaid
flowchart TD
    Start([Protected operation called]) --> GetAuth[Call getAuth from session.ts]
    GetAuth --> CheckSession{JWT in session cookie?}

    CheckSession -->|No| ReturnNull[Return null - not authenticated]
    CheckSession -->|Yes| CheckCache{Check 2-minute cache}

    CheckCache -->|Fresh cached user| ReturnCached[Return cached user data]
    CheckCache -->|No cache or expired| CallUserMe[Call getUserMe JWT]

    CallUserMe --> StrapiMe[GET /users/me with JWT in Authorization header]
    StrapiMe --> ValidateJWT{Strapi validates JWT}

    ValidateJWT -->|Invalid/Expired/Banned| ClearAuth[Clear cache and session]
    ValidateJWT -->|Valid| ReturnUser[Return current user data]

    ReturnUser --> UpdateCache[Cache user for 2 minutes]
    UpdateCache --> ReturnAuthenticated[Return authenticated user]

    ClearAuth --> ReturnNull
```

### Session Management Architecture

```mermaid
flowchart LR
    subgraph Client["TanStack Start Client"]
        UI[UI Components]
        ServerFunc[Server Functions]
    end

    subgraph Session["Session Layer"]
        Cookie[HTTP-only encrypted cookie]
        Cache[2-minute in-memory cache]
        GetAuth[getAuth function]
    end

    subgraph Strapi["Strapi Backend"]
        AuthAPI[/api/auth endpoints]
        UsersMeAPI[/users/me endpoint]
        JWT[JWT validation]
    end

    UI -->|Login/Register| ServerFunc
    ServerFunc -->|Validate| GetAuth
    GetAuth -->|Read| Cookie
    GetAuth -->|Check| Cache

    GetAuth -->|If not cached| UsersMeAPI
    UsersMeAPI -->|Validate| JWT
    JWT -->|Return user| GetAuth
    GetAuth -->|Cache result| Cache

    ServerFunc -->|Auth endpoints| AuthAPI
    AuthAPI -->|Return JWT| ServerFunc
    ServerFunc -->|Store| Cookie
```

---

## Redirect Logic

### Redirect Flow After Authentication

```mermaid
flowchart TD
    Start([Auth action completed]) --> CheckAction{What action?}

    CheckAction -->|Login success| LoginRedirect[router.navigate to '/']
    CheckAction -->|Register success| RegisterRedirect[router.navigate to '/']
    CheckAction -->|OAuth success| OAuthRedirect[HTTP 302 redirect to '/']
    CheckAction -->|Logout| LogoutRedirect[router.navigate to '/']

    LoginRedirect --> Invalidate1[router.invalidate]
    RegisterRedirect --> Invalidate2[router.invalidate]
    OAuthRedirect --> PageLoad[Page loads]
    LogoutRedirect --> Invalidate3[router.invalidate]

    Invalidate1 --> RootLoader1[Root loader runs]
    Invalidate2 --> RootLoader2[Root loader runs]
    PageLoad --> RootLoader3[Root loader runs]
    Invalidate3 --> RootLoader4[Root loader runs]

    RootLoader1 --> ValidateAuth1{Call getAuthServerFunction}
    RootLoader2 --> ValidateAuth2{Call getAuthServerFunction}
    RootLoader3 --> ValidateAuth3{Call getAuthServerFunction}
    RootLoader4 --> ValidateAuth4{Call getAuthServerFunction}

    ValidateAuth1 -->|Has JWT| ReturnUser1[Return currentUser]
    ValidateAuth2 -->|Has JWT| ReturnUser2[Return currentUser]
    ValidateAuth3 -->|Has JWT| ReturnUser3[Return currentUser]
    ValidateAuth4 -->|No JWT| ReturnNull[Return null]

    ReturnUser1 --> UIUpdate1[UI shows logged-in state]
    ReturnUser2 --> UIUpdate2[UI shows logged-in state]
    ReturnUser3 --> UIUpdate3[UI shows logged-in state]
    ReturnNull --> UIUpdate4[UI shows logged-out state]
```

### Route Protection (Currently No Automatic Protection)

```mermaid
flowchart TD
    Start([User navigates to any route]) --> RootLoader[Root loader always runs]
    RootLoader --> GetAuth[Call getAuthServerFunction]

    GetAuth --> CheckJWT{JWT in session?}
    CheckJWT -->|No| ReturnNull[Return currentUser: null]
    CheckJWT -->|Yes| Validate[Validate with /users/me]

    Validate --> ValidResult{Valid?}
    ValidResult -->|No| ClearSession[Clear session]
    ValidResult -->|Yes| ReturnUser[Return currentUser data]

    ClearSession --> ReturnNull

    ReturnNull --> LoadPage1[Page loads normally]
    ReturnUser --> LoadPage2[Page loads normally]

    LoadPage1 --> UICheck1{Component checks currentUser}
    LoadPage2 --> UICheck2{Component checks currentUser}

    UICheck1 -->|null| ShowPublic1[Show public UI - Sign-in CTA]
    UICheck2 -->|present| ShowAuth[Show authenticated UI - User menu]

    Note1[Note: No automatic redirects]
    Note2[Note: UI conditionally renders based on currentUser]
    Note3[Note: Backend enforces actual permissions]

    style Note1 fill:#ffffcc
    style Note2 fill:#ffffcc
    style Note3 fill:#ffffcc
```

### Current Redirect Destinations

```mermaid
flowchart LR
    subgraph Actions["Authentication Actions"]
        Login[Login Success]
        Register[Register Success]
        OAuth[OAuth Success]
        Logout[Logout]
    end

    subgraph Destination["All redirect to"]
        Home[Home Page '/']
    end

    Login --> Home
    Register --> Home
    OAuth --> Home
    Logout --> Home

    Note[All redirects are hardcoded to home]
    style Note fill:#ffffcc
```

---

## Comment System Flow

### Comment Creation Flow

```mermaid
sequenceDiagram
    actor User
    participant Form as CommentForm Component
    participant Query as TanStack Query
    participant ServerFn as Server Function
    participant Session as Session Manager
    participant Strapi as Strapi API
    participant DB as Database

    User->>Form: Types comment & submits
    Form->>Form: Client validation (length, empty)

    alt Validation fails
        Form-->>User: Show error message
    end

    Form->>Query: useMutation.mutate(data)
    Query->>ServerFn: createComment({ content, articleId })

    ServerFn->>Session: getAuth() - validate JWT
    Session->>Strapi: GET /users/me with JWT
    Strapi-->>Session: Return user or 401

    alt Not authenticated
        Session-->>ServerFn: null
        ServerFn-->>Query: { error: 'Authentication required' }
        Query-->>Form: Show error
    end

    ServerFn->>Session: Get JWT from session
    ServerFn->>Strapi: POST /comments/custom/create-comment
    Note over Strapi: Controller extracts user from ctx.state.user
    Strapi->>DB: Create comment with user relation
    DB-->>Strapi: Comment created
    Strapi-->>ServerFn: Return comment with populated user
    ServerFn-->>Query: Success response

    Query->>Query: Invalidate 'comments' query
    Query->>ServerFn: Refetch comments list
    ServerFn->>Strapi: GET /comments/custom/get-comments
    Strapi->>DB: Query comments with filters
    DB-->>Strapi: Return comments
    Strapi-->>ServerFn: Paginated results
    ServerFn-->>Query: Fresh comment data
    Query-->>Form: Updated list
    Form-->>User: Show new comment in list
```

### Comment Display & Pagination Flow

```mermaid
flowchart TD
    Start([CommentSection mounts]) --> InitQuery[Initialize TanStack Query]
    InitQuery --> BuildQueryKey[Query key: comments, articleId, page, search]
    BuildQueryKey --> CallServerFn[Call getCommentsForArticle]

    CallServerFn --> BuildFilters{Build Strapi filters}
    BuildFilters --> AddArticleFilter[Filter: articleId equals documentId]
    AddArticleFilter --> HasSearch{Has search query?}

    HasSearch -->|Yes| AddSearchFilter[Add $or filter: username or content contains query]
    HasSearch -->|No| BuildQuery[Build final query]
    AddSearchFilter --> BuildQuery

    BuildQuery --> AddPopulate[Populate user relation]
    AddPopulate --> AddPagination[Add pagination: page, pageSize]
    AddPagination --> AddSort[Sort by createdAt desc]

    AddSort --> StrapiRequest[GET /comments/custom/get-comments?query]
    StrapiRequest --> StrapiController[Strapi controller]
    StrapiController --> DBQuery[Database query with filters]

    DBQuery --> FetchComments[Fetch matching comments]
    FetchComments --> PopulateUsers[Populate user data]
    PopulateUsers --> ReturnResults[Return paginated results]

    ReturnResults --> CacheResults[Cache in React Query]
    CacheResults --> RenderList[Render CommentFeedItem for each]

    RenderList --> ShowPagination[Show pagination controls]
    ShowPagination --> ShowSearch[Show search box]

    ShowPagination --> UserAction{User action?}
    UserAction -->|Change page| UpdatePage[Update page state]
    UserAction -->|Search| UpdateSearch[Update search state]
    UserAction -->|No action| End([Display complete])

    UpdatePage --> BuildQueryKey
    UpdateSearch --> Debounce[300ms debounce]
    Debounce --> BuildQueryKey
```

### Comment Update Flow

```mermaid
sequenceDiagram
    actor User
    participant Item as CommentFeedItem
    participant Query as TanStack Query
    participant ServerFn as Server Function
    participant Session as Session Manager
    participant SDK as Strapi SDK
    participant Middleware as is-owner Middleware
    participant DB as Database

    User->>Item: Clicks Edit button
    Item->>Item: Enter edit mode (show textarea)
    User->>Item: Modifies content & clicks Save

    Item->>Query: updateComment.mutate(data)
    Query->>ServerFn: updateComment({ documentId, content })

    ServerFn->>Session: getAuth() - validate JWT
    Session-->>ServerFn: Return authenticated user

    ServerFn->>Session: Get JWT from session
    ServerFn->>SDK: PUT /api/comments/:documentId

    SDK->>Middleware: Check ownership
    Middleware->>DB: Fetch comment by documentId
    DB-->>Middleware: Return comment with user relation

    Middleware->>Middleware: Compare comment.user.documentId with ctx.state.user.documentId

    alt Not owner
        Middleware-->>SDK: 401 Unauthorized
        SDK-->>ServerFn: Error
        ServerFn-->>Query: { error: 'Not authorized' }
        Query-->>Item: Show error
    end

    Middleware->>DB: Update comment content
    DB-->>Middleware: Updated comment
    Middleware-->>SDK: Success response
    SDK-->>ServerFn: Updated comment
    ServerFn-->>Query: Success

    Query->>Item: onUpdate callback
    Item->>Item: Exit edit mode
    Item->>Query: Invalidate & refetch
    Query-->>Item: Fresh comment data
    Item-->>User: Show updated comment
```

### Comment Delete Flow

```mermaid
flowchart TD
    Start([User clicks Delete button]) --> Confirm{Browser confirmation dialog}

    Confirm -->|Cancel| End1([No action])
    Confirm -->|OK| CallMutation[Call deleteComment mutation]

    CallMutation --> ServerFn[Server function: deleteComment]
    ServerFn --> ValidateAuth{getAuth - validate JWT}

    ValidateAuth -->|Not authenticated| ReturnError1[Return error]
    ValidateAuth -->|Authenticated| GetJWT[Get JWT from session]

    GetJWT --> CallSDK[SDK: DELETE /api/comments/:documentId]
    CallSDK --> Middleware[is-owner middleware]

    Middleware --> FetchComment[Fetch comment from DB]
    FetchComment --> CheckOwner{comment.user.documentId === user.documentId?}

    CheckOwner -->|No| Return401[Return 401 Unauthorized]
    CheckOwner -->|Yes| DeleteDB[Delete from database]

    DeleteDB --> ReturnSuccess[Return success response]
    ReturnSuccess --> InvalidateQuery[Invalidate comments query]
    InvalidateQuery --> Refetch[Refetch comments list]
    Refetch --> UpdateUI[UI removes deleted comment]

    Return401 --> ReturnError2[Return error to client]
    ReturnError1 --> ShowError1[Show error message]
    ReturnError2 --> ShowError2[Show error message]

    UpdateUI --> End2([Complete])
    ShowError1 --> End1
    ShowError2 --> End1
```

### Comment System Architecture

```mermaid
flowchart TB
    subgraph Client["Client Components"]
        CommentSection[CommentSection Container]
        CommentForm[CommentForm]
        CommentFeed[CommentFeedItem]
        CommentSearch[CommentSearch]
        CommentPagination[CommentPagination]
    end

    subgraph State["State Management"]
        ReactQuery[TanStack Query]
        QueryCache[Query Cache]
        Mutations[Mutations]
    end

    subgraph ServerFunctions["TanStack Start Server Functions"]
        GetComments[getCommentsForArticle]
        CreateComment[createComment]
        UpdateComment[updateComment]
        DeleteComment[deleteComment]
    end

    subgraph SessionLayer["Session & Auth"]
        GetAuth[getAuth]
        UseSession[useAppSession]
        AuthCache[2-min auth cache]
    end

    subgraph StrapiAPI["Strapi API"]
        CustomRoutes[Custom Routes]
        StandardRoutes[Standard CRUD Routes]
        Controllers[Comment Controllers]
        Middlewares[Middlewares: set-user, is-owner]
    end

    subgraph Database["Database"]
        CommentsTable[Comments Collection]
        UsersTable[Users Collection]
    end

    CommentSection --> CommentForm
    CommentSection --> CommentFeed
    CommentSection --> CommentSearch
    CommentSection --> CommentPagination

    CommentForm --> ReactQuery
    CommentFeed --> ReactQuery
    CommentSearch --> ReactQuery
    CommentPagination --> ReactQuery

    ReactQuery --> QueryCache
    ReactQuery --> Mutations

    Mutations --> CreateComment
    Mutations --> UpdateComment
    Mutations --> DeleteComment
    ReactQuery --> GetComments

    CreateComment --> GetAuth
    UpdateComment --> GetAuth
    DeleteComment --> GetAuth
    GetComments --> CustomRoutes

    GetAuth --> UseSession
    GetAuth --> AuthCache
    GetAuth --> StrapiAPI

    CreateComment --> CustomRoutes
    UpdateComment --> StandardRoutes
    DeleteComment --> StandardRoutes

    CustomRoutes --> Controllers
    StandardRoutes --> Controllers
    Controllers --> Middlewares

    Middlewares --> CommentsTable
    Middlewares --> UsersTable
    CommentsTable -.relation.-> UsersTable
```

### Comment Data Flow Summary

```mermaid
flowchart LR
    subgraph Read["Read Operations (Public)"]
        R1[GET comments] --> R2[Filter by article]
        R2 --> R3[Optional search]
        R3 --> R4[Paginate results]
        R4 --> R5[Populate user data]
    end

    subgraph Write["Write Operations (Authenticated)"]
        W1[Validate JWT] --> W2[Check ownership if update/delete]
        W2 --> W3[Perform operation]
        W3 --> W4[Return result]
    end

    subgraph Security["Security Layers"]
        S1[HTTP-only cookie] --> S2[JWT validation]
        S2 --> S3[Owner verification]
        S3 --> S4[Strapi permissions]
    end

    Read --> Display[Display to user]
    Write --> Refresh[Refresh comment list]
    Security -.protects.-> Write
```

---

## Key Files Reference

### Authentication Files
- **Session Management:** `client/src/lib/session.ts`
- **Server Functions:** `client/src/data/server-functions/auth.ts`
- **Auth Services:** `client/src/lib/services/auth.ts`
- **Strapi SDK:** `client/src/data/strapi-sdk.ts`
- **Sign-in Page:** `client/src/routes/_auth/signin.tsx`
- **Sign-up Page:** `client/src/routes/_auth/signup.tsx`
- **OAuth Handler:** `client/src/routes/api.connect.$provider.redirect.tsx`

### Redirect Files
- **Root Loader:** `client/src/routes/__root.tsx`
- **Navigation:** `client/src/components/custom/top-navigation.tsx`
- **Logout Button:** `client/src/components/custom/logout-button.tsx`

### Comment Files
- **Main Component:** `client/src/components/custom/comment-section/index.tsx`
- **Comment Form:** `client/src/components/custom/comment-section/comment-form.tsx`
- **Comment Item:** `client/src/components/custom/comment-section/comment-feed-item.tsx`
- **Server Functions:** `client/src/data/server-functions/comments.ts`
- **Strapi Controller:** `server/src/api/comment/controllers/comment.ts`
- **Strapi Routes:** `server/src/api/comment/routes/`
- **Middlewares:** `server/src/api/comment/middlewares/` and `server/src/middlewares/is-owner.ts`

---

## Security Features

### Authentication Security
1. **HTTP-only cookies** - JavaScript cannot access JWT
2. **Encrypted sessions** - Uses SESSION_SECRET for encryption
3. **JWT validation** - Every protected operation validates with Strapi's /users/me
4. **2-minute cache** - Balances security and performance
5. **HTTPS in production** - Secure cookies in production mode
6. **CSRF protection** - sameSite: 'lax' cookie policy

### Comment Security
1. **Owner verification** - is-owner middleware on update/delete
2. **User auto-assignment** - set-user middleware prevents impersonation
3. **Backend enforcement** - Permissions enforced by Strapi, not client
4. **Input validation** - Content length limits and required fields
5. **Auth checks** - All write operations require valid JWT

---

## Data Structures

### Session Data
```typescript
{
  userId?: number,
  email?: string,
  username?: string,
  jwt?: string
}
```

### Comment Data
```typescript
{
  id: number,
  documentId: string,
  content: string,
  articleId: string,
  user?: {
    id: number,
    documentId: string,
    username: string,
    email: string
  },
  createdAt: string,
  updatedAt: string
}
```

### Auth User Data
```typescript
{
  id: number,
  documentId: string,
  username: string,
  email: string,
  provider?: string,
  confirmed?: boolean,
  blocked?: boolean
}
```
