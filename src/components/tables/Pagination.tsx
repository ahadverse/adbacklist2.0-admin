"use client";
import { FiChevronsRight, FiChevronsLeft} from "react-icons/fi";


interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
}

export default function Pagination({ page, limit, total, onPageChange, onLimitChange }: PaginationProps) {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

   const limitOptions = [10, 25, 50, 100]

  const getPageNumbers = () => {
    const delta = 2;
    const range: (number | string)[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
        range.push(i);
      } else if (range[range.length - 1] !== "...") {
        range.push("...");
      }
    }
    return range;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between border-t border-white/10 px-4 py-3 sm:px-6 gap-2">

      {/* Mobile Previous/Next */}
      <div className=" sm:hidden">
         <div>
          <p className="text-sm text-gray-300">
            Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{" "}
            <span className="font-medium">{Math.min(page * limit, total)}</span> of{" "}
            <span className="font-medium">{total}</span> results
          </p>
        </div>
        
        <div className="flex flex-1 justify-between my-2">
          <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="relative inline-flex items-center rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-white/10 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="relative ml-3 inline-flex items-center rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-white/10 disabled:opacity-50"
        >
          Next
        </button>
        </div>
        <div className="flex items-center gap-2">
        <span className="text-sm text-gray-300">Show</span>
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="rounded border border-gray-700 bg-white/5 px-2 py-1 text-gray-200 text-sm focus:outline-none"
        >
          {limitOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <span className="text-sm text-gray-300">per page</span>
      </div>
      </div>

      {/* Desktop pagination */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-300">
            Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{" "}
            <span className="font-medium">{Math.min(page * limit, total)}</span> of{" "}
            <span className="font-medium">{total}</span> results
          </p>
        </div>

        <div>
          
          <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 hover:bg-white/5 disabled:opacity-50"
            >
              <span className="sr-only">Previous</span>
              <FiChevronsLeft aria-hidden="true" className="size-5" />
            </button>

            {getPageNumbers().map((p, idx) =>
              p === "..." ? (
                <span
                  key={idx}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-400"
                >
                  ...
                </span>
              ) : (
                <button
                  key={idx}
                  onClick={() => onPageChange(Number(p))}
                  className={`relative z-10 inline-flex items-center px-4 py-2 text-sm font-semibold focus:outline-none ${
                    p === page
                      ? "bg-indigo-500 text-white"
                      : "text-gray-200 hover:bg-white/5"
                  }`}
                >
                  {p}
                </button>
              )
            )}

            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 hover:bg-white/5 disabled:opacity-50"
            >
              <span className="sr-only">Next</span>
              <FiChevronsRight aria-hidden="true" className="size-5" />
            </button>
          </nav>
        </div>
              <div className="flex items-center gap-2">
        <span className="text-sm text-gray-300">Show</span>
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="rounded border border-gray-700 bg-white/5 px-2 py-1 text-gray-200 text-sm focus:outline-none"
        >
          {limitOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <span className="text-sm text-gray-300">per page</span>
      </div>
      </div>
    </div>
  );
}
