export interface UserFollowing {
  id: string;
  displayName: string;
  userName: string;
  bio?: string;
  image: string;
  currentUserFollowing: boolean;
  folowersCount: number;
  folowingsCount: number;
}

export interface FollowOrUnfollowResult {
  observer: UserFollowing;
  target: UserFollowing;
}
