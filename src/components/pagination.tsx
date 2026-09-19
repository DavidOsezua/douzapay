import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { JSX } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps): JSX.Element {
  const atStart = currentPage <= 1;
  const atEnd = currentPage >= totalPages;

  return (
    <div className="mt-4 flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className="bg-transparent"
        onClick={() => onPageChange(1)}
        disabled={atStart}
        aria-label="First page"
      >
        <ChevronsLeft className="size-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="bg-transparent"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={atStart}
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" />
      </Button>

      <span className="text-sm">
        Page {currentPage} of {totalPages}
      </span>

      <Button
        variant="outline"
        size="icon"
        className="bg-transparent"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={atEnd}
        aria-label="Next page"
      >
        <ChevronRight className="size-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="bg-transparent"
        onClick={() => onPageChange(totalPages)}
        disabled={atEnd}
        aria-label="Last page"
      >
        <ChevronsRight className="size-4" />
      </Button>
    </div>
  );
}
