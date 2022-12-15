import { ActivitiesParams } from './../models/PagingParams';
import { PagedList } from './../models/PagedList';
import Activity, { ActivityModel } from '../models/Activity';
import ActivityAttendee from '../models/ActivityAttendee';
import { ignoreStatusCodes } from '../utils/axios';
import { requests } from './agent';
import { toISOStringWithTimezone } from '../utils/common';

const basePath = '/activities';
const activityApis = {
  list: (params: ActivitiesParams) =>
    requests.get<PagedList<Activity>>(basePath, {
      params: {
        ...params,
        startDate: toISOStringWithTimezone(params.startDate),
      },
    }),
  details: (id: string) => requests.get<Activity>(`${basePath}/${id}`),
  create: (activity: ActivityModel) =>
    requests.post<ActivityModel, Activity>(
      basePath,
      activity,
      ignoreStatusCodes()
    ),
  update: (activity: ActivityModel) =>
    requests.put<ActivityModel, Activity>(
      basePath,
      activity,
      ignoreStatusCodes()
    ),
  acceptAttendance: (activityId: string) =>
    requests.post<any, ActivityAttendee>(
      `${basePath}/${activityId}/accept`,
      undefined
    ),
  rejectAttendance: (activityId: string) =>
    requests.post<any, void>(`${basePath}/${activityId}/reject`, undefined),
  cancelActivity: (activityId: string) =>
    requests.post<any, void>(`${basePath}/${activityId}/cancel`, undefined),
  reactivateActivity: (activityId: string) =>
    requests.post<any, void>(`${basePath}/${activityId}/reactivate`, undefined),
};

export default activityApis;
