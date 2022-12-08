using Application.Activities.Dtos;
using AutoMapper;
using Domain;
using Domain.Exceptions;
using Domain.Repositories;
using Domain.Services;
using MediatR;

namespace Application.Activities;

public class UpdateActivityCommand : IRequest<ActivityWithAttendees>
{
    public ActivityDto Activity { get; set; }
}

public class UpdateActivityCommandHandler : IRequestHandler<UpdateActivityCommand, ActivityWithAttendees>
{
    private readonly IActivityRepository _activityRepository;
    private readonly ICurrentUserContext _currentUserContext;
    private readonly IMapper _mapper;

    public UpdateActivityCommandHandler(
        IActivityRepository activityRepository,
        ICurrentUserContext currentUserContext,
        IMapper mapper)
    {
        _activityRepository = activityRepository;
        _currentUserContext = currentUserContext;
        _mapper = mapper;
    }

    public async Task<ActivityWithAttendees> Handle(UpdateActivityCommand request, CancellationToken cancellationToken)
    {
        var currentActivity = await _activityRepository.GetById(request.Activity.Id);
        if (currentActivity == null)
            throw new NotFoundException(ErrorCode.APP0009, "Update rejected. Activity is not found.");
        var userId = _currentUserContext.GetCurrentUserId();
        if (!currentActivity.Attendees.Any(x => x.IsHost && x.UserId == userId))
            throw new FrameworkException(ErrorCode.APP_DONT_HAVE_EDIT_PERMISSION, "You don't have permission to edit this activity.");
        if (currentActivity.IsCancelled)
            throw new FrameworkException(ErrorCode.APP0015, "Update rejected. Activity is cancelled.");

        var activity = _mapper.Map<Activity>(request.Activity);
        await _activityRepository.Update(activity);

        var updatedActivity = await _activityRepository.GetById(id: activity.Id);
        return updatedActivity;
    }
}