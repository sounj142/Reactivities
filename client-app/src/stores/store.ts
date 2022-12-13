import { createContext, useContext } from 'react';
import ActivityStore from './activity-store';
import CommentStore from './comment-store';
import CommonStore from './common-store';
import FollowStore from './follow-store';
import ModalStore from './modal-store';
import ProfileStore from './profile-store';
import UserStore from './user-store';

interface Store {
  activityStore: ActivityStore;
  commonStore: CommonStore;
  userStore: UserStore;
  modalStore: ModalStore;
  profileStore: ProfileStore;
  commentStore: CommentStore;
  followStore: FollowStore;
}

export const store: Store = {
  activityStore: new ActivityStore(),
  commonStore: new CommonStore(),
  userStore: new UserStore(),
  modalStore: new ModalStore(),
  profileStore: new ProfileStore(),
  commentStore: new CommentStore(),
  followStore: new FollowStore(),
};

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}
