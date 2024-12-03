"use client";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formattedDate } from "../helpers/formattedDate";
import { PaginationDemo } from "@/components/ui/views/PaginationDemo";
import { useSearchParams, useRouter } from "next/navigation";
import { DialogBook } from "@/components/ui/views/DialogBook";
import { AlertConfirmation } from "@/components/ui/views/AlertConfirmation";
import { EditDialogBook } from "@/components/ui/views/EditDialogBook";

interface Author {
  id: number;
  name: string;
  email: string;
}

interface Book {
  id: number;
  title: string;
  serial_number: string;
  published_at: string;
  author_id: number;
  createdAt: string;
  updatedAt: string;
  Author: Author;
}

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const params = useSearchParams();
  const router = useRouter();

  async function getBooks() {
    try {
      const response = await fetch(
        `http://localhost:3000/api/books?page=${page}`,
        {
          cache: "no-store",
          method: "GET",
        }
      );

      const { data, totalPages } = await response.json();
      setBooks(data);
      setTotalPages(totalPages);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const param = params.get("page");
    let pageNum = param ? parseInt(param) : 1;

    if (pageNum > totalPages) {
      pageNum = totalPages;
    }

    setPage(pageNum);
  }, [params, totalPages]);

  useEffect(() => {
    getBooks();

    router.push(`/?page=${page}`);
  }, [page]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="text-center flex flex-col">
        <h1 className="text-center font-mono text-2xl my-6 font-semibold">
          Books Table List
        </h1>
        <DialogBook refreshBook={getBooks} />
      </div>
      <Table>
        <TableCaption>A list of your recent books.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Title</TableHead>
            <TableHead>Serial Number</TableHead>
            <TableHead>Published At</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {books.length > 0 ? (
            books.map((book) => (
              <TableRow key={book.id}>
                <TableCell className="font-medium truncate">
                  {book.title}
                </TableCell>
                <TableCell>{book.serial_number}</TableCell>
                <TableCell>{formattedDate(book.published_at)}</TableCell>
                <TableCell>{book.Author?.name}</TableCell>
                <TableCell className="flex gap-2">
                  <EditDialogBook refreshBooks={getBooks} bookss={book} />
                  <AlertConfirmation item_id={book.id} refreshData={getBooks} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5}>No books available</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <PaginationDemo
        totalPages={totalPages}
        currentPage={page}
        url="/?page="
      />
    </div>
  );
}
