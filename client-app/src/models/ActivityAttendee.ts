export default interface ActivityAttendee {
  activityId: string;
  userId: string;
  dateJoined: Date;
  isHost: boolean;
  email: string;
  userName: string;
  displayName: string;
  bio: string;
  image: string;
}
