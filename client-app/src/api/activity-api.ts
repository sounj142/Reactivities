import Activity from '../models/Activity';
import { requests } from './agent';

const activityApis = {
  list: () => requests.get<Activity[]>('/activities'),
  details: (id: string) => requests.get<Activity>(`/activities/${id}`),
  create: (activity: Activity) =>
    requests.post<Activity, any>('/activities', activity),
  update: (activity: Activity) =>
    requests.put<Activity, any>('/activities', activity),
  delete: (id: string) => requests.delete(`/activities/${id}`),
};

export default activityApis;