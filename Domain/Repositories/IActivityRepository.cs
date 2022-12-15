using Domain.Activities;
using Domain.Common;

namespace Domain.Repositories;

public interface IActivityRepository
{
    Task<ActivityWithAttendees> GetById(Guid id, bool throwIfNotFound = false);

    Task<PagedList<ActivityWithAttendees>> GetAll(int currentPage, int pageSize,
        bool? isGoing, bool? isHost, DateTimeOffset? startDate);

    Task Create(Activity activity, string userId, DateTimeOffset dateJoined);

    Task Update(Activity activity);

    Task<AttendeeWithFollowInfo> Accept(Guid activityId, string userId, DateTimeOffset dateJoined);

    Task Reject(Guid activityId, string userId);

    Task Cancel(Guid activityId);
    Task Reactivate(Guid activityId);
    Task<IList<ActivityMinimumInfo>> GetActivitiesOfUser(
        string userId, ActivityFilterPredicateType predicate);
}