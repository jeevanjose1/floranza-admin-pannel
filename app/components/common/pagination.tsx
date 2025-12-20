import { Button } from "../ui/button";
import useQueryParams from "~/hooks/use-query-param";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

type Props = {
  is_next: boolean;
  is_previous: boolean;
  current_page?: number;
  total_pages?: number;
  show_page_numbers?: boolean;
  max_visible_pages?: number;
};

export default function Pagination({
  is_next,
  is_previous,
  current_page = 1,
  total_pages = 1,
  show_page_numbers = true,
  max_visible_pages = 5,
}: Props) {
  const { updateUrl } = useQueryParams();

  const handlePagination = (page: number) => {
    updateUrl({
      page: page.toString(),
    });
  };

  const handlePrevious = () => {
    if (is_previous && current_page > 1) {
      handlePagination(current_page - 1);
    }
  };

  const handleNext = () => {
    if (is_next) {
      handlePagination(current_page + 1);
    }
  };

  // Generate page numbers to display
  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    const half = Math.floor(max_visible_pages / 2);
    
    let start = Math.max(1, current_page - half);
    let end = Math.min(total_pages, current_page + half);

    // Adjust if we're near the beginning or end
    if (current_page <= half) {
      end = Math.min(total_pages, max_visible_pages);
    } else if (current_page + half >= total_pages) {
      start = Math.max(1, total_pages - max_visible_pages + 1);
    }

    // Add first page and ellipsis if needed
    if (start > 1) {
      pages.push(1);
      if (start > 2) {
        pages.push('...');
      }
    }

    // Add page numbers
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add ellipsis and last page if needed
    if (end < total_pages) {
      if (end < total_pages - 1) {
        pages.push('...');
      }
      pages.push(total_pages);
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="flex items-center justify-center space-x-2 py-4">
      {/* Previous Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrevious}
        disabled={!is_previous}
        className="flex items-center gap-1"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      {/* Page Numbers */}
      {show_page_numbers && total_pages > 1 && (
        <div className="flex items-center space-x-1">
          {pageNumbers.map((page, index) => (
            <div key={index}>
              {page === '...' ? (
                <Button
                  variant="ghost"
                  size="sm"
                  disabled
                  className="w-8 h-8 p-0"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant={current_page === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePagination(page as number)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Next Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleNext}
        disabled={!is_next}
        className="flex items-center gap-1"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}