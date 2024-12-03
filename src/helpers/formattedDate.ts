// helpers/formattedDate.ts menggunakan date-fns
import { format } from "date-fns";
import { id } from "date-fns/locale";

export function formattedDate(dateString: string): string {
  const date = new Date(dateString);
  return format(date, "dd MMMM yyyy", { locale: id });
}
