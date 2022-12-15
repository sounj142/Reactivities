export interface ActivityMinimumInfo {
  id: string;
  title: string;
  date: Date;
  category: string;
}

export enum ActivityFilterPredicateType {
  All = 'all',
  Future = 'future',
  Past = 'past',
  Hosting = 'hosting',
}
