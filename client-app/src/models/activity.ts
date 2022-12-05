import { v4 as uuidv4 } from 'uuid';

interface ActivityCommonProps {
  id: string;
  title: string;
  description: string;
  category: string;
  city: string;
  venue: string;
}

export default interface Activity extends ActivityCommonProps {
  date: Date;
}

export interface ActivityModel extends ActivityCommonProps {
  date: Date | null;
}

export function emptyActivity(): ActivityModel {
  return {
    id: uuidv4(),
    title: '',
    date: null,
    description: '',
    category: '',
    city: '',
    venue: '',
  };
}
