using Domain.Exceptions;
using Domain.Repositories;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Persistence.Daos;
using Domain.Activities;
using Domain.Services;

namespace Persistence.Repositories;

public class ActivityRepository : IActivityRepository
{
    private readonly DataContext _dbContext;
    private readonly IMapper _mapper;
    private readonly ICurrentUserContext _currentUserContext;

    public ActivityRepository(DataContext dbContext,
        IMapper mapper,
        ICurrentUserContext currentUserContext)
    {
        _currentUserContext = currentUserContext;
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public async Task<ActivityWithAttendees> GetById(Guid id, bool throwIfNotFound = false)
    {
        var currentUserId = _currentUserContext.GetCurrentUserId();
        var activity = await _dbContext.Activities.AsNoTracking()
            .ProjectTo<ActivityWithAttendees>(_mapper.ConfigurationProvider, new { currentUserId })
            .FirstOrDefaultAsync(p => p.Id == id);
        if (throwIfNotFound && activity == null)
            throw new NotFoundException(ErrorCode.REPO0003, "Activity is not found.");

        return activity;
    }

    public async Task<IList<ActivityWithAttendees>> GetAll()
    {
        var currentUserId = _currentUserContext.GetCurrentUserId();
        var activities = await _dbContext.Activities.AsNoTracking()
            .ProjectTo<ActivityWithAttendees>(_mapper.ConfigurationProvider, new { currentUserId })
            .ToListAsync();
        return activities;
    }

    public async Task Create(Activity activity, string userId, DateTimeOffset dateJoined)
    {
        var activityDao = _mapper.Map<ActivityDao>(activity);
        activityDao.Attendees = new List<ActivityAttendeeDao>
        {
             new ActivityAttendeeDao
             {
                UserId = userId,
                DateJoined = dateJoined,
                IsHost = true,
             }
        };
        _dbContext.Activities.Add(activityDao);
        await _dbContext.SaveChangesAsync();
    }

    public async Task Update(Activity activity)
    {
        var activityDao = await _dbContext.Activities
            .FirstOrDefaultAsync(x => x.Id == activity.Id);
        if (activityDao == null)
            throw new NotFoundException(ErrorCode.REPO0001, "Update rejected. Activity is not found.");

        _mapper.Map(activity, activityDao);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<AttendeeWithFollowInfo> Accept(Guid activityId, string userId, DateTimeOffset dateJoined)
    {
        _dbContext.ActivityAttendees.Add(new ActivityAttendeeDao
        {
            ActivityId = activityId,
            UserId = userId,
            IsHost = false,
            DateJoined = dateJoined
        });
        await _dbContext.SaveChangesAsync();

        var activityAttendee = _dbContext.ActivityAttendees
            .ProjectTo<AttendeeWithFollowInfo>(_mapper.ConfigurationProvider)
            .FirstOrDefault(x => x.UserId == userId && x.ActivityId == activityId);
        return activityAttendee;
    }

    public async Task Reject(Guid activityId, string userId)
    {
        var activityAttendee = _dbContext.ActivityAttendees.FirstOrDefault(
            x => x.ActivityId == activityId && x.UserId == userId
        );
        if (activityAttendee == null)
            throw new NotFoundException(ErrorCode.REPO0004, "Deletion failed! ActivityAttendee not found.");

        _dbContext.ActivityAttendees.Remove(activityAttendee);
        await _dbContext.SaveChangesAsync();
    }

    public async Task Cancel(Guid activityId)
    {
        var activity = await _dbContext.Activities
             .FirstOrDefaultAsync(x => x.Id == activityId);
        if (activity == null)
            throw new NotFoundException(ErrorCode.REPO0002, "Cancellation rejected. Activity is not found.");

        activity.IsCancelled = true;
        await _dbContext.SaveChangesAsync();
    }

    public async Task Reactivate(Guid activityId)
    {
        var activity = await _dbContext.Activities
             .FirstOrDefaultAsync(x => x.Id == activityId);
        if (activity == null)
            throw new NotFoundException(ErrorCode.REPO0005, "Cancellation rejected. Activity is not found.");

        activity.IsCancelled = false;
        await _dbContext.SaveChangesAsync();
    }
}