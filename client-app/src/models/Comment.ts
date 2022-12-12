export interface CommentCreate {
  body: string;
  activityId: string;
}

export interface ChatComment {
  id: string;
  body: string;
  createdAt: Date;
  activityId: string;
  authorId: string;
  authorUserName: string;
  authorDisplayName: string;
  authorImage: string;
}
