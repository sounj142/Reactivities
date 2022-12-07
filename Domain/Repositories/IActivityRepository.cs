namespace Domain.Repositories;

public interface IActivityRepository
{
    Task<ActivityWithAttendees> GetById(Guid id, bool throwIfNotFound = false);

    Task<IList<ActivityWithAttendees>> GetAll();

    Task Create(Activity activity, ActivityAttendee userInfo);

    Task Update(Activity activity);

    Task Delete(Guid id);
}