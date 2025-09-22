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

## Reference Documentation

**Note for Claude:** When working on TanStack Start features, use WebFetch to consult these references if needed for implementation details or best practices.

### TanStack Router
- **Search Parameters:** https://tanstack.com/router/latest/docs/framework/react/guide/search-params
- **Data Loading:** https://tanstack.com/router/latest/docs/framework/react/guide/data-loading