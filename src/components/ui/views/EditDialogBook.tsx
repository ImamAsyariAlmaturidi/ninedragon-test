"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

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

interface EditDialogBookProps {
  bookss: Book;
  refreshBooks: () => void;
}

export function EditDialogBook({ bookss, refreshBooks }: EditDialogBookProps) {
  const { toast } = useToast();
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  const [title, setTitle] = useState<string>(bookss.title);
  const [serialNumber, setSerialNumber] = useState<string>(
    bookss.serial_number
  );
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [author, setAuthor] = useState<Author[]>([]);

  async function getAuthors() {
    try {
      const response = await fetch("http://localhost:3000/api/authors", {
        cache: "no-store",
        method: "GET",
      });

      const { data } = await response.json();
      setAuthor(data);
    } catch (error) {
      console.error("Error fetching authors:", error);
    }
  }

  useEffect(() => {
    getAuthors();
  }, []);

  const handleSaveChanges = async () => {
    try {
      const updatedBook = {
        ...bookss,
        title,
        serial_number: serialNumber,
        author_id: selectedAuthor ? parseInt(selectedAuthor) : bookss.author_id,
      };

      const response = await fetch(
        `http://localhost:3000/api/books/${bookss.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedBook),
        }
      );

      console.log(await response.json());

      refreshBooks();
      toast({
        variant: "default",
        description: "Update Books Success.",
      });
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        variant: "default",
        description: "Failed update book",
      });
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
          Edit Book
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Book</DialogTitle>
          <DialogDescription>
            Make changes to your Book here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Title
            </Label>
            <Input
              id="name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="serialNumber" className="text-right">
              Serial Number
            </Label>
            <Input
              id="serialNumber"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 w-full items-center gap-4">
            <Label htmlFor="author" className="text-right">
              Author
            </Label>
            <Select
              value={selectedAuthor || ""}
              onValueChange={(value) => setSelectedAuthor(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent className="min-w-[200px]">
                <SelectGroup>
                  {author.length > 0 ? (
                    author.map((authors) => (
                      <SelectItem key={authors.id} value={String(authors.id)}>
                        {authors.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="">No authors available</SelectItem>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSaveChanges}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
