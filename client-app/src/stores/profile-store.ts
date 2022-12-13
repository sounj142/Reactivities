import { Photo } from './../models/Photo';
import { UserAbout, UserProfile } from './../models/UserProfile';
import { makeAutoObservable, runInAction } from 'mobx';
import profileApis from '../api/profile-api';
import { store } from './store';
import { UserFollowing } from '../models/Follower';
import { fixFollowingInfo } from './follow-store';

export default class ProfileStore {
  profile?: UserProfile = undefined;
  loadingProfile = false;
  processingPhoto = false;

  constructor() {
    makeAutoObservable(this);
  }

  setProfile = (profile?: UserProfile) => {
    this.profile = profile;
  };

  setLoadingProfile = (value: boolean) => {
    this.loadingProfile = value;
  };

  setProcessingPhoto = (value: boolean) => {
    this.processingPhoto = value;
  };

  getProfile = async (userName: string) => {
    this.setLoadingProfile(true);
    try {
      const profile = await profileApis.getProfile(userName);
      this.setProfile(profile);
    } finally {
      this.setLoadingProfile(false);
    }
  };

  checkProfileIsCurrentUser = (profile: UserProfile) => {
    return profile.userName === store.userStore.user?.userName;
  };

  private changeMainPhotoOfProfile = (photo: Photo) => {
    if (!this.profile) return;
    this.profile.image = photo.url;
    store.userStore.updateMainPhoto(photo.url);
    store.activityStore.updateActivitiesMainPhoto();
  };

  private addNewPhotoToProfile = (photo: Photo) => {
    if (!this.profile) return;
    this.profile.photos.push(photo);
    if (photo.isMain) {
      this.changeMainPhotoOfProfile(photo);
    }
  };

  uploadPhoto = async (file: Blob) => {
    this.setProcessingPhoto(true);
    try {
      const photo = await profileApis.uploadPhoto(file);
      this.addNewPhotoToProfile(photo);
    } finally {
      this.setProcessingPhoto(false);
    }
  };

  private removePhotoFromProfile = (photoId: string) => {
    if (!this.profile) return;
    this.profile.photos = this.profile.photos.filter((x) => x.id !== photoId);
  };

  deletePhoto = async (photoId: string) => {
    this.setProcessingPhoto(true);
    try {
      await profileApis.deletePhoto(photoId);
      this.removePhotoFromProfile(photoId);
    } finally {
      this.setProcessingPhoto(false);
    }
  };

  private processAfterSetMainPhoto = (photoId: string) => {
    const photo = this.profile?.photos.find((p) => p.id === photoId);
    if (!photo) return;
    this.profile!.photos.forEach((p) => {
      p.isMain && (p.isMain = false);
    });
    photo.isMain = true;
    this.changeMainPhotoOfProfile(photo);
  };

  setMainPhoto = async (photoId: string) => {
    this.setProcessingPhoto(true);
    try {
      await profileApis.setMainPhoto(photoId);
      this.processAfterSetMainPhoto(photoId);
    } finally {
      this.setProcessingPhoto(false);
    }
  };

  updateProfileAbout = async (data: UserAbout) => {
    await profileApis.updateProfileAbout(data);
    runInAction(() => {
      if (!this.profile) return;
      this.profile.displayName = data.displayName;
      this.profile.bio = data.bio;
      store.userStore.updateProfileAbout(data);
      store.activityStore.updateProfileAbout(data);
    });
  };

  fixProfileStoreAfterChangeFollowing = (
    observer: UserFollowing,
    target: UserFollowing,
    isFollow: boolean
  ) => {
    if (!this.profile) return;
    if (this.profile.userName === observer.userName) {
      if (isFollow) this.profile.followings.push({ ...target });
      else
        this.profile.followings = this.profile.followings.filter(
          (x) => x.userName !== target.userName
        );
    } else if (this.profile.userName === target.userName) {
      if (isFollow) this.profile.followers.push({ ...observer });
      else
        this.profile.followers = this.profile.followers.filter(
          (x) => x.userName !== observer.userName
        );
    }
    this.profile.followers.forEach((x) =>
      fixFollowingInfo(x, observer, target)
    );
    this.profile.followings.forEach((x) =>
      fixFollowingInfo(x, observer, target)
    );
  };
}