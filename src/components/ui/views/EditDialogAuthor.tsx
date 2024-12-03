"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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

interface EditDialogProps {
  author_id: number;
  refreshAuthors: () => void;
}

interface Author {
  id: number;
  name: string;
  email: string;
}

export function EditDialogAuthor({
  author_id,
  refreshAuthors,
}: EditDialogProps) {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [author, setAuthor] = useState<Author | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  async function getDataById() {
    try {
      const response = await fetch(`/api/authors/${author_id}`, {
        cache: "no-store",
        method: "GET",
      });

      const { data } = await response.json();
      setAuthor(data);
      setName(data.name);
      setEmail(data.email);
    } catch (error) {
      console.log(error);
    }
  }

  async function updateAuthor() {
    try {
      const response = await fetch(
        `http://localhost:3000/api/authors/${author_id}`,
        {
          cache: "no-store",
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
          }),
        }
      );

      setIsOpen(false);
      toast({
        variant: "default",
        description: "Update Author Success.",
      });
      refreshAuthors();
    } catch (error) {
      console.log(error);
      toast({
        variant: "default",
        description: "Failed Update Author .",
      });
    }
  }

  useEffect(() => {
    if (isOpen) {
      getDataById();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Update Author</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update author</DialogTitle>
          <DialogDescription>
            Make changes to your author here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={updateAuthor}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
