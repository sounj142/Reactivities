namespace Domain.Repositories;

public interface IActivityRepository
{
    Task<Activity> GetById(Guid id);

    Task<IList<Activity>> GetAll();

    Task Create(Activity activity);

    Task Update(Activity activity);

    Task Delete(Guid id);
}