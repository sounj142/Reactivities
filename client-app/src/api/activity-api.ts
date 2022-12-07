import Activity from '../models/Activity';
import { ignoreStatusCodes } from '../utils/axios';
import { requests } from './agent';

const basePath = '/activities';
const activityApis = {
  list: () => requests.get<Activity[]>(basePath),
  details: (id: string) => requests.get<Activity>(`${basePath}/${id}`),
  create: (activity: Activity) =>
    requests.post<Activity, any>(basePath, activity, ignoreStatusCodes()),
  update: (activity: Activity) =>
    requests.put<Activity, any>(basePath, activity, ignoreStatusCodes()),
  delete: (id: string) => requests.delete(`${basePath}/${id}`),
};

export default activityApis;
