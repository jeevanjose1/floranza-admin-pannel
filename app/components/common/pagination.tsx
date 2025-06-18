import { Button } from "../ui/button";
import useQueryParams from "~/hooks/use-query-param";

type Props = {
  is_next: boolean;
  is_previous: boolean;
  current_page?: number;
};

export default function Pagination({
  is_next,
  is_previous,
  current_page = 1,
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

  return (
    <div className="flex items-center justify-end space-x-2 ">
      <div className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={!is_previous}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={!is_next}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
