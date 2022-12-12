import { CommentCreate } from './../models/Comment';
import { makeAutoObservable, runInAction } from 'mobx';
import {
  createHubConnection,
  registerEventToHub,
  stopHubConnection,
  callMethod,
} from '../api/chat-hub';
import { ChatComment } from '../models/Comment';
import { store } from './store';

export default class CommentStore {
  comments: ChatComment[] = [];
  commentCreatingError: any = undefined;

  constructor() {
    makeAutoObservable(this);
  }

  createHubConnection = (activityId: string) => {
    this.comments = [];
    this.commentCreatingError = undefined;
    if (store.userStore.isLoggedIn) {
      createHubConnection(activityId);

      registerEventToHub('LoadComments', (comments: ChatComment[]) => {
        runInAction(() => {
          comments.forEach(
            (comment) => (comment.createdAt = new Date(comment.createdAt))
          );
          this.comments = comments;
        });
      });

      registerEventToHub('CommentCreated', (comment: ChatComment) => {
        runInAction(() => {
          comment.createdAt = new Date(comment.createdAt);
          this.comments.unshift(comment);
        });
      });

      registerEventToHub('CommentCreatingError', (error: any) => {
        runInAction(() => (this.commentCreatingError = error));
      });
    }
  };

  stopHubConnection = () => {
    stopHubConnection();
  };

  clearComments = () => {
    this.stopHubConnection();
    this.comments = [];
    this.commentCreatingError = undefined;
  };

  createComment = (model: CommentCreate) => {
    this.commentCreatingError = undefined;
    return callMethod('SendComment', model);
  };
}
