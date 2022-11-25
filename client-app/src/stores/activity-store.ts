import { makeAutoObservable, runInAction } from 'mobx';
import activityApis from '../api/activity-api';
import Activity from '../models/Activity';

export default class ActivityStore {
  activities: Activity[] = [];
  selectedActivity?: Activity = undefined;
  loadingInitial = true;
  editMode = false;
  deletingId: string = '';
  formSubmitting = false;

  constructor() {
    makeAutoObservable(this);
  }

  setDeletingId = (value: string) => {
    this.deletingId = value;
  };

  changeActivity = (activity?: Activity) => {
    this.selectedActivity = activity;
  };

  sortActivities() {
    this.activities.sort((x, y) => Date.parse(x.date) - Date.parse(y.date));
  }

  setFormSubmitting(value: boolean) {
    this.formSubmitting = value;
  }

  handleFormOpen = (activity?: Activity) => {
    this.editMode = true;
    this.selectedActivity = activity;
  };

  handleFormClose = () => {
    this.editMode = false;
  };

  viewButtonHandle = (activity: Activity) => {
    this.handleFormClose();
    this.selectedActivity = activity;
  };

  loadActivities = async () => {
    this.loadingInitial = true;
    const data = await activityApis.list();

    runInAction(() => {
      this.activities = data.map((x) => ({ ...x, date: x.date.split('T')[0] }));
      this.sortActivities();
      this.loadingInitial = false;
    });
  };

  deleteActivity = async (activity: Activity) => {
    this.setDeletingId(activity.id);
    try {
      await activityApis.delete(activity.id);
      runInAction(() => {
        this.activities = this.activities.filter((x) => x.id !== activity.id);
        if (activity.id === this.selectedActivity?.id) {
          this.selectedActivity = undefined;
          this.editMode = false;
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
        this.handleFormClose();
        const newActivity = { ...activity };
        const index = this.activities.findIndex((x) => x.id === newActivity.id);
        if (index >= 0) this.activities[index] = newActivity;
        else this.activities.push(newActivity);
        this.selectedActivity = newActivity;
        this.sortActivities();
      });
    } finally {
      this.setFormSubmitting(false);
    }
  };
}
