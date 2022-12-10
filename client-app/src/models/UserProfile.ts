import { Photo } from './Photo';

export interface UserProfile {
  id: string;
  email: string;
  userName: string;
  displayName: string;
  bio?: string;
  image?: string;
  photos: Photo[];
}
