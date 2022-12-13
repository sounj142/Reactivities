namespace Domain.Activities;

public class AttendeeWithFollowInfo : Attendee
{
    public bool CurrentUserFollowing { get; set; }
    public int FolowersCount { get; set; }
    public int FolowingsCount { get; set; }
}