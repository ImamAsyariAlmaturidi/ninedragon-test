"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { toast, useToast } from "@/hooks/use-toast";
interface AlertConfirmationProps {
  item_id: number;
  refreshData: () => void;
}

export function AlertConfirmation({
  item_id,
  refreshData,
}: AlertConfirmationProps) {
  const params = useSearchParams();
  const pageParam = params.get("page");
  const page = pageParam ? Number(pageParam) : 1;
  const { toast } = useToast();

  async function handleDelete() {
    const id = item_id;
    try {
      let apiUrl = "";

      if (window.location.pathname.includes("/author")) {
        apiUrl = `/api/authors`;
      } else {
        apiUrl = `/api/books`;
      }

      const response = await fetch(apiUrl, {
        cache: "no-store",
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      toast({
        variant: "default",
        description: "Delete Items Success.",
      });
      await refreshData();
    } catch (error) {
      console.log(error);
      toast({
        variant: "default",
        description: "Failed Delete Item.",
      });
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"destructive"}>Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the item!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
