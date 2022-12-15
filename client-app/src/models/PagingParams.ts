export interface PagingParams {
  currentPage: number;
  pageSize: number;
}

export interface ActivitiesParams extends PagingParams {
  isGoing?: boolean;
  isHost?: boolean;
  startDate?: Date;
}
