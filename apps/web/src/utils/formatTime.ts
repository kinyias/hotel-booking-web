import { format } from "date-fns";
import { vi } from 'date-fns/locale';
export function formatDate(date: string | Date){
    return format(date, 'dd/MM/yyyy', { locale: vi })
}