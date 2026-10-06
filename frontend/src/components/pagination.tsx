import { DOTS, usePagination } from "../hooks/use-pagination";

type PaginationProps = {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({
  currentPage,
  pageSize,
  totalCount,
  onPageChange,
}: PaginationProps) => {
  const paginationRange = usePagination({
    totalCount,
    pageSize,
    currentPage,
  });

  return (
    <div className="flex items-center gap-2 justify-center">
      {paginationRange.map((item, index) => {
        if (item === DOTS) {
          return <span key={item + index}>...</span>;
        }

        return (
          <button
            key={item + index}
            onClick={() => onPageChange(item)}
            className={
              item === currentPage
                ? "flex items-center justify-center active:scale-95 w-9 md:w-12 h-9 md:h-12 aspect-square bg-indigo-500 text-white rounded-md transition-all"
                : "flex items-center justify-center active:scale-95 w-9 md:w-12 h-9 md:h-12 aspect-square bg-white border border-gray-200 rounded-md hover:bg-gray-100/70 transition-all"
            }
          >
            {item}
          </button>
        );
      })}
    </div>
  );
};

export default Pagination;
