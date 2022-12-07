using Domain;
using Domain.Exceptions;
using Domain.Repositories;
using AutoMapper;
using AutoMapper.QueryableExtensions;
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

    public async Task<ActivityWithAttendees> GetById(Guid id, bool throwIfNotFound = false)
    {
        var activity = await _dbContext.Activities.AsNoTracking()
            .ProjectTo<ActivityWithAttendees>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(p => p.Id == id);
        if (throwIfNotFound && activity == null)
            throw new NotFoundException(ErrorCode.REPO0003, $"Activity '{id}' was not found.");

        return activity;
    }

    public async Task<IList<ActivityWithAttendees>> GetAll()
    {
        var activities = await _dbContext.Activities.AsNoTracking()
            .ProjectTo<ActivityWithAttendees>(_mapper.ConfigurationProvider)
            .ToListAsync();
        return activities;
    }

    public async Task Create(Activity activity, ActivityAttendee userInfo)
    {
        var activityDao = _mapper.Map<ActivityDao>(activity);
        activityDao.Attendees = new List<ActivityAttendeeDao>
        {
             _mapper.Map<ActivityAttendeeDao>(userInfo)
        };
        _dbContext.Activities.Add(activityDao);

        await _dbContext.SaveChangesAsync();
    }

    public async Task Update(Activity activity)
    {
        var activityDao = await _dbContext.Activities
            .FindAsync(activity.Id);
        if (activityDao == null)
            throw new NotFoundException(ErrorCode.REPO0001, $"Update rejected. Activity '{activity.Id}' was not found.");

        _mapper.Map(activity, activityDao);
        await _dbContext.SaveChangesAsync();
    }

    public async Task Delete(Guid id)
    {
        var activityDao = await _dbContext.Activities.FindAsync(id);
        if (activityDao == null)
            throw new NotFoundException(ErrorCode.REPO0002, $"Delete rejected. Activity '{id}' was not found.");

        _dbContext.Activities.Remove(activityDao);
        await _dbContext.SaveChangesAsync();
    }
}