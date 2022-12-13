import { UserFollowing } from './Follower';
import { Photo } from './Photo';

export interface UserAbout {
  displayName: string;
  bio?: string;
}

export interface UserProfile extends UserAbout {
  id: string;
  email: string;
  userName: string;
  image?: string;
  photos: Photo[];
  followers: UserFollowing[];
  followings: UserFollowing[];
}
