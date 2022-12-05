import { v4 as uuidv4 } from 'uuid';

export default interface Activity {
  id: string;
  title: string;
  date: string;
  description: string;
  category: string;
  city: string;
  venue: string;
}

export function emptyActivity(): Activity {
  return {
    id: uuidv4(),
    title: '',
    date: '',
    description: '',
    category: '',
    city: '',
    venue: '',
  };
}
