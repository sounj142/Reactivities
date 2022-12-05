import { makeAutoObservable, runInAction } from 'mobx';
import activityApis from '../api/activity-api';
import Activity from '../models/Activity';
import { formatDate } from '../utils/common';

export default class ActivityStore {
  private activities: Activity[] = [];
  selectedActivity?: Activity = undefined;
  loadingInitial = true;
  deletingId: string = '';
  formSubmitting = false;
  activitiesLoaded = false;

  constructor() {
    makeAutoObservable(this);
  }

  setDeletingId = (value: string) => {
    this.deletingId = value;
  };

  changeActivity = (activity?: Activity) => {
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
    });
  };

  private formatActivityData(activity: Activity): Activity {
    if (activity) {
      const date =
        activity.date instanceof Date ? activity.date : new Date(activity.date);
      return { ...activity, date };
    }
    return activity;
  }

  loadActivity = async (id: string) => {
    if (this.selectedActivity?.id !== id) {
      this.changeActivity(undefined);
    }
    let activity = this.activities.find((x) => x.id === id);
    if (!activity) {
      activity = this.formatActivityData(await activityApis.details(id));
    }
    this.changeActivity(activity);
  };

  deleteActivity = async (activity: Activity) => {
    this.setDeletingId(activity.id);
    try {
      await activityApis.delete(activity.id);
      runInAction(() => {
        this.activities = this.activities.filter((x) => x.id !== activity.id);
        if (activity.id === this.selectedActivity?.id) {
          this.selectedActivity = undefined;
        }
      });
    } finally {
      this.setDeletingId('');
    }
  };

  createOrUpdateActivity = async (activity: Activity) => {
    this.setFormSubmitting(true);
    try {
      if (this.selectedActivity) {
        await activityApis.update(activity);
      } else {
        await activityApis.create(activity);
      }
      runInAction(() => {
        const newActivity = this.formatActivityData(activity);
        const index = this.activities.findIndex((x) => x.id === newActivity.id);
        if (index >= 0) this.activities[index] = newActivity;
        else this.activities.push(newActivity);
        this.selectedActivity = newActivity;
      });
    } finally {
      this.setFormSubmitting(false);
    }
  };
}
