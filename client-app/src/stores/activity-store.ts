import { UserDto } from './../models/User';
import { makeAutoObservable, reaction, runInAction } from 'mobx';
import activityApis from '../api/activity-api';
import Activity, { ActivityModel } from '../models/Activity';
import { formatDate } from '../utils/common';
import { store } from './store';
import { UserAbout } from '../models/UserProfile';
import { UserFollowing } from '../models/Follower';
import { fixFollowingInfo } from './follow-store';
import { emptyPagedList, PagedList } from '../models/PagedList';
import { ActivitiesParams } from '../models/PagingParams';

const PAGE_SIZE = 5;

export default class ActivityStore {
  private activitiesData: PagedList<Activity> = emptyPagedList(PAGE_SIZE);
  // importtant: in some cases, selectedActivity will not belong to current activities list
  selectedActivity?: Activity = undefined;
  loadingInitial = true;
  loadingNextPage = false;
  formSubmitting = false;
  params: ActivitiesParams = {
    currentPage: 1,
    pageSize: PAGE_SIZE,
    isGoing: undefined,
    isHost: undefined,
    startDate: new Date(),
  };

  constructor() {
    makeAutoObservable(this);
    reaction(
      () => ({
        isGoing: this.params.isGoing,
        isHost: this.params.isHost,
        startDate: this.params.startDate,
      }),
      async () => {
        this.params.currentPage = 1;
        this.params.pageSize = PAGE_SIZE;
        this.activitiesData.data = [];
        await this.loadActivitiesForFirstTime();
      }
    );
  }

  changeSelectedActivity = (activity?: Activity) => {
    this.selectedActivity = activity;
  };

  setParamIsGoing = () => {
    this.params.isGoing = true;
    this.params.isHost = undefined;
  };

  setParamIsHost = () => {
    this.params.isGoing = undefined;
    this.params.isHost = true;
  };

  setParamAll = () => {
    this.params.isGoing = undefined;
    this.params.isHost = undefined;
  };

  setStartDate = (date?: Date) => {
    this.params.startDate = date;
  };

  get hasNextPage(): boolean {
    return this.activitiesData.hasNextPage;
  }

  get activitiesGroupByDate(): { date: string; activities: Activity[] }[] {
    const result: { date: string; activities: Activity[] }[] = [];
    const sortedActivities = this.activitiesData.data
      .map((x) => x)
      .sort((x, y) => {
        const compare = x.date.getTime() - y.date.getTime();
        return compare ? compare : x.title.localeCompare(y.title);
      });

    sortedActivities.forEach((activity) => {
      const dateInYMD = formatDate(activity.date);
      let group = result.find((x) => x.date === dateInYMD);
      if (!group) {
        group = {
          date: dateInYMD,
          activities: [],
        };
        result.push(group);
      }
      group.activities.push(activity);
    });

    return result;
  }

  setFormSubmitting(value: boolean) {
    this.formSubmitting = value;
  }

  loadActivitiesForFirstTime = async () => {
    if (this.activitiesData.data.length) return;
    this.loadingInitial = true;
    await this.loadActivities();
    runInAction(() => (this.loadingInitial = false));
  };

  loadActivitiesForNextPage = async () => {
    if (!this.hasNextPage) return;
    this.loadingNextPage = true;
    try {
      this.params.currentPage++;
      await this.loadActivities();
    } finally {
      runInAction(() => (this.loadingNextPage = false));
    }
  };

  loadActivities = async () => {
    const result = await activityApis.list(this.params);

    runInAction(() => {
      result.data.forEach((activity) => {
        activity = this.formatActivityData(activity);
        const index = this.activitiesData.data.findIndex(
          (x) => x.id === activity.id
        );
        if (index >= 0) {
          this.activitiesData.data[index] = activity;
        } else {
          this.activitiesData.data.push(activity);
        }
      });

      result.data = this.activitiesData.data;
      this.params.currentPage = result.currentPage;
      this.params.pageSize = result.pageSize;
      this.activitiesData = result;
    });
  };

  private formatActivityData(activity: Activity): Activity {
    if (activity) {
      if (!(activity.date instanceof Date))
        activity.date = new Date(activity.date);
      activity.attendees.sort((x, y) =>
        x.displayName.localeCompare(y.displayName)
      );
    }
    return activity;
  }

  loadActivity = async (id: string) => {
    if (this.selectedActivity?.id !== id) {
      this.changeSelectedActivity(undefined);
    }
    let activity = this.activitiesData.data.find((x) => x.id === id);
    if (!activity) {
      const activityFromServer = await activityApis.details(id);
      activity = this.formatActivityData(activityFromServer);
    }
    this.changeSelectedActivity(activity);
  };

  // only need to call this method if we do one of below action
  // - add activity
  // - update activity date
  // - change activity attendees (add/remove)
  private standardizeActivitisAfterActivityCreatedOrChanged = (
    activity: Activity
  ) => {
    this.formatActivityData(activity);
    const index = this.activitiesData.data.findIndex(
      (x) => x.id === activity.id
    );

    if (activity.id === this.selectedActivity?.id) {
      this.changeSelectedActivity(activity);
    }

    if (index >= 0) this.activitiesData.data[index] = activity;
    else {
      this.activitiesData.data.push(activity);
    }
  };

  private callAsyncMethod = async (func: () => Promise<any>) => {
    this.setFormSubmitting(true);
    try {
      await func();
    } finally {
      this.setFormSubmitting(false);
    }
  };

  createOrUpdateActivity = async (activity: ActivityModel) => {
    let updatedActivity = this.selectedActivity
      ? await activityApis.update(activity)
      : await activityApis.create(activity);
    this.standardizeActivitisAfterActivityCreatedOrChanged(updatedActivity);
  };

  getHostInfo = (activity: Activity) => {
    return activity.attendees.find((x) => x.isHost);
  };

  checkCurrentUserIsHostOf = (activity: Activity) => {
    const userName = store.userStore.user?.userName;
    return userName && userName === this.getHostInfo(activity)?.userName;
  };

  checkCurrentUserJoinActivity = (activity: Activity) => {
    const userName = store.userStore.user?.userName;
    return userName && activity.attendees.find((x) => x.userName === userName);
  };

  acceptAttendance = (activity: Activity) => {
    return this.callAsyncMethod(async () => {
      const attendee = await activityApis.acceptAttendance(activity.id);
      runInAction(() => {
        activity.attendees.push(attendee);
        this.standardizeActivitisAfterActivityCreatedOrChanged(activity);
      });
    });
  };

  rejectAttendance = (activity: Activity) => {
    return this.callAsyncMethod(async () => {
      await activityApis.rejectAttendance(activity.id);
      runInAction(() => {
        const userName = store.userStore.user?.userName;
        activity.attendees = activity.attendees.filter(
          (x) => x.userName !== userName
        );
      });
    });
  };

  cancelActivity = (activity: Activity) => {
    return this.callAsyncMethod(async () => {
      await activityApis.cancelActivity(activity.id);
      runInAction(() => {
        activity.isCancelled = true;
      });
    });
  };

  reactivateActivity = (activity: Activity) => {
    return this.callAsyncMethod(async () => {
      await activityApis.reactivateActivity(activity.id);
      runInAction(() => {
        activity.isCancelled = false;
      });
    });
  };

  private updateUserPhotoOfActivity = (
    activity: Activity | undefined,
    user: UserDto
  ) => {
    if (!activity) return;
    activity.attendees.forEach((attendee) => {
      if (attendee.userName === user.userName) {
        attendee.image = user.image;
      }
    });
  };

  updateActivitiesMainPhoto = () => {
    const user = store.userStore.user;
    if (!user) return;
    this.updateUserPhotoOfActivity(this.selectedActivity, user);
    this.activitiesData.data.forEach((activity) =>
      this.updateUserPhotoOfActivity(activity, user)
    );
  };

  private updateProfileAboutOfActivity = (
    activity: Activity | undefined,
    data: UserAbout,
    userName: string
  ) => {
    if (!activity) return;
    activity.attendees.forEach((attendee) => {
      if (attendee.userName === userName) {
        attendee.displayName = data.displayName;
        if (data.bio !== undefined) attendee.bio = data.bio;
      }
    });
  };

  updateProfileAbout = (data: UserAbout) => {
    const user = store.userStore.user;
    if (!user) return;
    this.updateProfileAboutOfActivity(
      this.selectedActivity,
      data,
      user.userName
    );
    this.activitiesData.data.forEach((activity) =>
      this.updateProfileAboutOfActivity(activity, data, user.userName)
    );
  };

  broadcastFollowingChanged = (
    observer: UserFollowing,
    target: UserFollowing
  ) => {
    this.activitiesData.data.forEach((activity) => {
      activity.attendees.forEach((attendee) =>
        fixFollowingInfo(attendee, observer, target)
      );
    });
  };
}
