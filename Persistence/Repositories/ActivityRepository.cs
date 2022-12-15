using Domain.Exceptions;
using Domain.Repositories;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Persistence.Daos;
using Domain.Activities;
using Domain.Services;
using Domain.Common;
using Persistence.Utils;

namespace Persistence.Repositories;

public class ActivityRepository : IActivityRepository
{
    private readonly DataContext _dbContext;
    private readonly IMapper _mapper;
    private readonly ICurrentUserContext _currentUserContext;

    public ActivityRepository(
        DataContext dbContext,
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

    public async Task<PagedList<ActivityWithAttendees>> GetAll(int currentPage, int pageSize,
        bool? isGoing, bool? isHost, DateTimeOffset? startDate)
    {
        var currentUserId = _currentUserContext.GetCurrentUserId();
        IQueryable<ActivityWithAttendees> activitiesQuery = _dbContext.Activities.AsNoTracking()
            .ProjectTo<ActivityWithAttendees>(_mapper.ConfigurationProvider, new { currentUserId });

        if (isHost == true)
        {
            activitiesQuery = activitiesQuery
                .Where(a => a.Attendees.Any(u => u.UserId == currentUserId && u.IsHost));
        }
        else if (isGoing == true)
        {
            activitiesQuery = activitiesQuery
                .Where(a => a.Attendees.Any(u => u.UserId == currentUserId));
        }

        if (startDate.HasValue)
        {
            activitiesQuery = activitiesQuery
                .Where(a => a.Date >= startDate.Value);
        }

        activitiesQuery = activitiesQuery
            .OrderBy(x => x.Date)
            .ThenBy(x => x.Title);

        var activities = await Helpers.CreatePageList(activitiesQuery, currentPage, pageSize);
        return activities;
    }

    public async Task<IList<ActivityMinimumInfo>> GetActivitiesOfUser(
        string userId, ActivityFilterPredicateType predicate)
    {
        var query = _dbContext.Activities.AsNoTracking();
        var now = _currentUserContext.GetClientNow();

        switch (predicate)
        {
            case ActivityFilterPredicateType.Future:
                query = query.Where(a =>
                    a.Date >= now &&
                    a.Attendees.Any(x => x.UserId == userId));
                break;
            case ActivityFilterPredicateType.Past:
                query = query.Where(a =>
                    a.Date < now &&
                    a.Attendees.Any(x => x.UserId == userId));
                break;
            case ActivityFilterPredicateType.Hosting:
                query = query.Where(a =>
                    a.Attendees.Any(x => x.IsHost && x.UserId == userId));
                break;
            default:
                query = query.Where(a =>
                    a.Attendees.Any(x => x.UserId == userId));
                break;
        }

        return await query
            .OrderBy(x => x.Date)
            .ThenBy(x => x.Title)
            .ProjectTo<ActivityMinimumInfo>(_mapper.ConfigurationProvider)
            .ToListAsync();
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