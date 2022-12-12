import { makeAutoObservable, runInAction } from 'mobx';
import {
  createHubConnection,
  registerEventToHub,
  stopHubConnection,
} from '../api/chat-hub';
import { ChatComment } from '../models/Comment';
import { store } from './store';

export default class CommentStore {
  comments: ChatComment[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  createHubConnection = (activityId: string) => {
    if (store.userStore.isLoggedIn) {
      createHubConnection(activityId);

      registerEventToHub('LoadComments', (comments: ChatComment[]) => {
        console.log('receive comments', comments);

        runInAction(() => (this.comments = comments));
      });

      registerEventToHub('CommentCreated', (comment: ChatComment) => {
        console.log('receive new comment', comment);
        runInAction(() => this.comments.push(comment));
      });
    }
  };

  stopHubConnection = () => {
    stopHubConnection();
  };

  clearComments = () => {
    this.stopHubConnection();
    this.comments = [];
  };
}
