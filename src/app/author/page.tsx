"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertConfirmation } from "@/components/ui/views/AlertConfirmation";
import { DialogAuthor } from "@/components/ui/views/DialogAuthor";
import { EditDialogAuthor } from "@/components/ui/views/EditDialogAuthor";
import { PaginationDemo } from "@/components/ui/views/PaginationDemo";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Author {
  id: number;
  name: string;
  email: string;
}

export default function Home() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const params = useSearchParams();

  async function getAuthors(page: number) {
    try {
      const response = await fetch(`/api/authors?page=${page}`, {
        cache: "no-store",
        method: "GET",
      });

      const { data, totalPages } = await response.json();
      setAuthors(data);
      setTotalPages(totalPages);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const param = params.get("page");
    const pageNum = param ? parseInt(param) : 1;
    setPage(pageNum);
    getAuthors(pageNum);
  }, [params]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col">
        <h1 className="text-center font-mono text-2xl font-semibold my-6">
          Authors Table List
        </h1>
        <DialogAuthor refreshAuthor={() => getAuthors(page)} />
      </div>
      <Table>
        <TableCaption>A list of your recent authors.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {authors.length > 0 ? (
            authors.map((author) => (
              <TableRow key={author.id}>
                <TableCell className="font-medium truncate">
                  {author.id}
                </TableCell>
                <TableCell>{author.name}</TableCell>
                <TableCell>{author.email}</TableCell>
                <TableCell className="flex gap-2">
                  <EditDialogAuthor
                    author_id={author.id}
                    refreshAuthors={() => getAuthors(page)}
                  />
                  <AlertConfirmation
                    item_id={author.id}
                    refreshData={() => getAuthors(page)}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4}>No authors available</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <PaginationDemo
        totalPages={totalPages}
        currentPage={page}
        url="/author?page="
      />
    </div>
  );
}
