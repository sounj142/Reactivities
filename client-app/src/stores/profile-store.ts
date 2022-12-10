import { Photo } from './../models/Photo';
import { UserProfile } from './../models/UserProfile';
import { makeAutoObservable } from 'mobx';
import profileApis from '../api/profile-api';
import { store } from './store';

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
}
