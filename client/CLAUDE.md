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

## Reference Documentation

**Note for Claude:** When working on TanStack Start features, use WebFetch to consult these references if needed for implementation details or best practices.

### TanStack Router
- **Search Parameters:** https://tanstack.com/router/latest/docs/framework/react/guide/search-params
- **Data Loading:** https://tanstack.com/router/latest/docs/framework/react/guide/data-loading