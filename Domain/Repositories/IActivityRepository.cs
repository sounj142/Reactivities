namespace Domain.Repositories;

public interface IActivityRepository
{
    Task<ActivityWithAttendees> GetById(Guid id, bool throwIfNotFound = false);

    Task<IList<ActivityWithAttendees>> GetAll();

    Task Create(Activity activity, string userId, DateTimeOffset dateJoined);

    Task Update(Activity activity);

    Task<Attendee> Accept(Guid activityId, string userId, DateTimeOffset dateJoined);

    Task Reject(Guid activityId, string userId);

    Task Cancel(Guid activityId);
    Task Reactivate(Guid activityId);
}