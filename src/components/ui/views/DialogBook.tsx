"use client";
import { Button } from "@/components/ui/button";
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
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation"; // Import useRouter

interface Author {
  id: number;
  name: string;
  email: string;
}

interface DialogBookProps {
  refreshBook: () => Promise<void>;
}

export function DialogBook({ refreshBook }: DialogBookProps) {
  const { toast } = useToast();
  const router = useRouter(); // Initialize useRouter
  const [author, setAuthor] = useState<Author[] | null>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
  async function addBook() {
    try {
      const response = await fetch("/api/books", {
        cache: "no-store",
        method: "POST",
        body: JSON.stringify({ selectedAuthor, title, serialNumber }),
      });

      const { data } = await response.json();

      if (data && data.title) {
        toast({
          variant: "default",
          description: `Book titled "${data.title}" added successfully!`,
        });

        await refreshBook();
        router.push("/");
        setIsDialogOpen(false);
      } else {
        toast({
          variant: "destructive",
          description: "Failed to add book. Please try again.",
        });
      }
    } catch (error) {
      console.log("Error:", error);
      toast({
        variant: "destructive",
        description: "An error occurred. Please try again.",
      });
    }
  }

  useEffect(() => {
    getAuthors();
  }, []);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
          Add Book
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Book</DialogTitle>
          <DialogDescription>
            Create a Book here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Title
            </Label>
            <Input
              id="name"
              className="col-span-3"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="serialNumber" className="text-right">
              Serial Number
            </Label>
            <Input
              id="serialNumber"
              className="col-span-3"
              onChange={(e) => setSerialNumber(e.target.value)}
            />
          </div>
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
                {author && author.length > 0 ? (
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

        <DialogFooter>
          <Button onClick={addBook} type="button">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
