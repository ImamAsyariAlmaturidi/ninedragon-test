"use client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface PaginationDemoProps {
  totalPages: number;
  url: string;
  currentPage: number;
}

export function PaginationDemo({
  totalPages,
  url,
  currentPage: initialCurrentPage,
}: PaginationDemoProps) {
  const [currentPage, setCurrentPage] = useState(initialCurrentPage);
  const params = useSearchParams();
  const router = useRouter();

  // Syncing page number with URL when URL is updated externally
  useEffect(() => {
    const param = params.get("page");
    const pageNum = param ? parseInt(param, 10) : 1; // Default to page 1
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  }, [params, totalPages]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      router.push(`${url}${page}`);
      setCurrentPage(page);
    }
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
            className={currentPage <= 1 ? "disabled-class" : ""}
          />
        </PaginationItem>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              onClick={() => handlePageChange(page)}
              isActive={page === currentPage}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            onClick={() =>
              currentPage < totalPages && handlePageChange(currentPage + 1)
            }
            className={currentPage >= totalPages ? "disabled-class" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
