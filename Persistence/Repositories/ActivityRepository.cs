using Domain;
using Domain.Exceptions;
using Domain.Repositories;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Persistence.Daos;

namespace Persistence.Repositories;

public class ActivityRepository : IActivityRepository
{
    private readonly DataContext _dbContext;
    private readonly IMapper _mapper;

    public ActivityRepository(DataContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public async Task<Activity> GetById(Guid id)
    {
        var activityDao = await _dbContext.Activities.AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id);
        return _mapper.Map<Activity>(activityDao);
    }

    public async Task<IList<Activity>> GetAll()
    {
        var activitiyDaos = await _dbContext.Activities.AsNoTracking()
            .OrderBy(p => p.Title)
            .ToListAsync();
        return _mapper.Map<IList<Activity>>(activitiyDaos);
    }

    public async Task Create(Activity activity)
    {
        var activityDao = _mapper.Map<ActivityDao>(activity);
        _dbContext.Activities.Add(activityDao);

        await _dbContext.SaveChangesAsync();
    }

    public async Task Update(Activity activity)
    {
        var activityDao = await _dbContext.Activities
            .FindAsync(activity.Id);
        if (activityDao == null)
        {
            throw new NotFoundException($"Update rejected. Activity '{activity.Id}' was not found.");
        }

        _mapper.Map(activity, activityDao);
        await _dbContext.SaveChangesAsync();
    }

    public async Task Delete(Guid id)
    {
        var activityDao = await _dbContext.Activities.FindAsync(id);
        if (activityDao == null)
        {
            throw new NotFoundException($"Delete rejected. Activity '{id}' was not found.");
        }

        _dbContext.Activities.Remove(activityDao);
        await _dbContext.SaveChangesAsync();
    }
}