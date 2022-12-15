import { format } from 'date-fns';

export function getImageUrl(category: string): string {
  return `/assets/categoryImages/${category}.jpg`;
}

export const toISOStringWithTimezone = (date: Date | undefined | null) => {
  if (date === null || date === undefined) return date;
  return format(date, "yyyy-MM-dd'T'HH:mm:ssxxx");
};

export const formatDateTime = (date: Date) => {
  return format(date, 'dd MMM yyyy h:mm aa');
};

export const formatDate = (date: Date) => {
  return format(date, 'dd MMMM yyyy');
};

export const formatTime = (date: Date) => {
  return format(date, 'h:mm aa');
};

export function truncateText(text: string | null | undefined, length: number) {
  if (text) {
    return text.length > length ? text.substring(0, length - 3) + '...' : text;
  }
  return text;
}

const timeZone = new Date().getTimezoneOffset();
export function getClientTimeZone() {
  return timeZone;
}
