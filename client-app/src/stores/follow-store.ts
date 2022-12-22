import { makeAutoObservable } from 'mobx';
import followApis from '../api/follow-api';
import ActivityAttendee from '../models/ActivityAttendee';
import { UserFollowing } from '../models/Follower';
import { store } from './store';

export function fixFollowingInfo(
  attendee: ActivityAttendee | UserFollowing,
  observer: UserFollowing,
  target: UserFollowing
) {
  if (attendee.userName === target.userName) {
    attendee.folowersCount = target.folowersCount;
    attendee.folowingsCount = target.folowingsCount;
    attendee.currentUserFollowing = target.currentUserFollowing;
  } else if (attendee.userName === observer.userName) {
    attendee.folowersCount = observer.folowersCount;
    attendee.folowingsCount = observer.folowingsCount;
    attendee.currentUserFollowing = observer.currentUserFollowing;
  }
}

export default class FollowStore {
  followerLoading?: string = undefined;

  constructor() {
    makeAutoObservable(this);
  }

  private setFollowerLoading = (value?: string) => {
    this.followerLoading = value;
  };

  followOrUnfollow = async (userName: string, isFollow: boolean) => {
    this.setFollowerLoading(userName);
    try {
      const { observer, target } = await followApis.followOrUnfollow(
        userName,
        isFollow
      );
      store.activityStore.broadcastFollowingChanged(observer, target);
      store.profileStore.broadcastFollowingChanged(observer, target, isFollow);
    } finally {
      this.setFollowerLoading(undefined);
    }
  };
}
