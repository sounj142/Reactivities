namespace Domain.Repositories;

public interface IActivityRepository
{
    Task<Activity> GetById(Guid id, bool throwIfNotFound = false);

    Task<IList<Activity>> GetAll();

    Task Create(Activity activity);

    Task Update(Activity activity);

    Task Delete(Guid id);
}