import { FollowOrUnfollowResult } from '../models/Follower';
import { requests } from './agent';

const basePath = '/follow';
const followApis = {
  followOrUnfollow: (userName: string, isFollow: boolean) =>
    requests.post<any, FollowOrUnfollowResult>(basePath, {
      targetUserName: userName,
      isFollow,
    }),
};

export default followApis;
