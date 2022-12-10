import { UserDto } from './../models/User';
import { makeAutoObservable, runInAction } from 'mobx';
import activityApis from '../api/activity-api';
import Activity, { ActivityModel } from '../models/Activity';
import { formatDate } from '../utils/common';
import { store } from './store';
import { UserAbout } from '../models/UserProfile';

export default class ActivityStore {
  private activities: Activity[] = [];
  selectedActivity?: Activity = undefined;
  loadingInitial = true;
  formSubmitting = false;
  activitiesLoaded = false;

  constructor() {
    makeAutoObservable(this);
  }

  changeSelectedActivity = (activity?: Activity) => {
    this.selectedActivity = activity;
  };

  get activitiesGroupByDate(): { date: string; activities: Activity[] }[] {
    const result: { date: string; activities: Activity[] }[] = [];
    const sortedActivities = this.activities
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

  loadActivities = async (forceLoad = false) => {
    if (!forceLoad && this.activitiesLoaded) return;
    this.loadingInitial = true;
    const data = await activityApis.list();

    runInAction(() => {
      this.activities = data.map(this.formatActivityData);
      this.loadingInitial = false;
      this.activitiesLoaded = true;
      if (this.selectedActivity) {
        this.selectedActivity = this.activities.find(
          (x) => x.id === this.selectedActivity?.id
        );
      }
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
    let activity = this.activities.find((x) => x.id === id);
    if (!activity) {
      activity = this.formatActivityData(await activityApis.details(id));
    }
    this.changeSelectedActivity(activity);
  };

  // only need to call this method if we do one of below action
  // - add activity
  // - update activity date
  // - change activity attendees (add/remove)
  private standardizeActivitisAfterAnActivityChanged = (activity: Activity) => {
    this.formatActivityData(activity);
    const index = this.activities.findIndex((x) => x.id === activity.id);
    if (index >= 0) this.activities[index] = activity;
    else this.activities.push(activity);

    if (activity.id === this.selectedActivity?.id) {
      this.changeSelectedActivity(activity);
    }
    return activity;
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
    this.standardizeActivitisAfterAnActivityChanged(updatedActivity);
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
        this.standardizeActivitisAfterAnActivityChanged(activity);
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
    this.activities.forEach((activity) =>
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
        attendee.bio = data.bio;
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
    this.activities.forEach((activity) =>
      this.updateProfileAboutOfActivity(activity, data, user.userName)
    );
  };
}
