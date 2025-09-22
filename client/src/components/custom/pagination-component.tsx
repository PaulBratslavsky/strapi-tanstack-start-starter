import { FC } from "react";
import { useRouter, useSearch } from "@tanstack/react-router";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface IPaginationProps {
  pageCount: number;
  className?: string;
}

interface IPaginationArrowProps {
  direction: "left" | "right";
  pageNumber: number;
  isDisabled: boolean;
}

const PaginationArrow: FC<IPaginationArrowProps> = ({
  direction,
  pageNumber,
  isDisabled,
}) => {
  const router = useRouter();
  const isLeft = direction === "left";
  const disabledClassName = isDisabled ? "opacity-50 cursor-not-allowed" : "";

  // Make next button (right arrow) more visible with primary theme styling
  const buttonClassName = isLeft
    ? `bg-secondary text-secondary-foreground hover:bg-secondary/80 ${disabledClassName}`
    : `bg-primary text-primary-foreground hover:bg-primary/90 ${disabledClassName}`;

  const handleClick = () => {
    if (isDisabled) return;

    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set("page", pageNumber.toString());

    window.history.replaceState(null, "", currentUrl.toString());
    router.invalidate();
  };

  return (
    <Button
      onClick={handleClick}
      className={buttonClassName}
      aria-disabled={isDisabled}
      disabled={isDisabled}
    >
      {isLeft ? "«" : "»"}
    </Button>
  );
};

export function PaginationComponent({ pageCount, className }: Readonly<IPaginationProps>) {
  const search = useSearch({ strict: false });
  const currentPage = Number((search as any)?.page) || 1;

  return (
    <Pagination className={cn("", className)}>
      <PaginationContent>
        <PaginationItem>
          <PaginationArrow
            direction="left"
            pageNumber={currentPage - 1}
            isDisabled={currentPage <= 1}
          />
        </PaginationItem>
        <PaginationItem>
          <span className="p-2 font-semibold text-primary">
            Page {currentPage}
          </span>
        </PaginationItem>
        <PaginationItem>
          <PaginationArrow
            direction="right"
            pageNumber={currentPage + 1}
            isDisabled={currentPage >= pageCount}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}