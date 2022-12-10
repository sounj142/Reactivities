import { Photo } from '../models/Photo';
import { UserDto } from '../models/User';
import { UserProfile } from '../models/UserProfile';
import { requests } from './agent';

const basePath = '/profiles';
const profileApis = {
  getProfile: (userName: string) =>
    requests.get<UserProfile>(`${basePath}/${userName}`),
  uploadPhoto: (file: Blob) => {
    const formData = new FormData();
    formData.append('file', file);
    return requests.post<FormData, Photo>(
      `${basePath}/upload-photo`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
  },
  setMainPhoto: (photoId: string) =>
    requests.put<undefined, UserDto>(
      `${basePath}/set-main-photo/${photoId}`,
      undefined
    ),
  deletePhoto: (photoId: string) =>
    requests.delete(`${basePath}/delete-photo/${photoId}`, undefined),
};

export default profileApis;
