import { useRouter, useSearch } from "@tanstack/react-router";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { cn } from "@/lib/utils";

interface IPaginationProps {
  pageCount: number;
  className?: string;
}

export function PaginationComponent({ pageCount, className }: Readonly<IPaginationProps>) {
  const router = useRouter();
  const search = useSearch({ strict: false });
  const currentPage = Number((search as any)?.page) || 1;

  const handlePageChange = (page: number) => {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set("page", page.toString());
    window.history.replaceState(null, "", currentUrl.toString());
    router.invalidate();
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: Array<number | "ellipsis"> = [];
    const showEllipsis = pageCount > 7;

    if (!showEllipsis) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= pageCount; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("ellipsis");
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(pageCount - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < pageCount - 2) {
        pages.push("ellipsis");
      }

      // Always show last page
      if (pageCount > 1) {
        pages.push(pageCount);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <Pagination className={cn("", className)}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) {
                handlePageChange(currentPage - 1);
              }
            }}
            aria-disabled={currentPage <= 1}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>

        {pageNumbers.map((page, index) => (
          <PaginationItem key={index} className={typeof page === "number" ? "" : "hidden md:block"}>
            {page === "ellipsis" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(page);
                }}
                isActive={currentPage === page}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < pageCount) {
                handlePageChange(currentPage + 1);
              }
            }}
            aria-disabled={currentPage >= pageCount}
            className={currentPage >= pageCount ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}