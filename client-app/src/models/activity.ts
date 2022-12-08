import { v4 as uuidv4 } from 'uuid';
import ActivityAttendee from './ActivityAttendee';

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
  isCancelled: boolean;
  attendees: ActivityAttendee[];
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

export function mapToActivity(model: ActivityModel): Activity {
  return {
    ...model,
    date: model.date!,
    isCancelled: false,
    attendees: [],
  };
}

export function mapToActivityModel(model: Activity): ActivityModel {
  return {
    id: model.id,
    title: model.title,
    date: model.date,
    description: model.description,
    category: model.category,
    city: model.city,
    venue: model.venue,
  };
}
