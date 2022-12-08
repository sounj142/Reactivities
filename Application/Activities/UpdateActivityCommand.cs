using Application.Activities.Dtos;
using AutoMapper;
using Domain;
using Domain.Exceptions;
using Domain.Repositories;
using Domain.Services;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Activities;

public class UpdateActivityCommand : IRequest
{
    public ActivityDto Activity { get; set; }
}

public class UpdateActivityCommandHandler : IRequestHandler<UpdateActivityCommand>
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

    public async Task<Unit> Handle(UpdateActivityCommand request, CancellationToken cancellationToken)
    {
        var currentActivity = await _activityRepository.GetById(request.Activity.Id);
        if (currentActivity == null)
            throw new NotFoundException(ErrorCode.APP0009, "Update rejected. Activity is not found.");
        var userId = _currentUserContext.GetCurrentUserId();
        if (!currentActivity.Attendees.Any(x => x.IsHost && x.UserId == userId))
            throw new FrameworkException(ErrorCode.APP_DONT_HAVE_EDIT_PERMISSION, "You don't have permission to edit this activity.");

        var activity = _mapper.Map<Activity>(request.Activity);
        await _activityRepository.Update(activity);
        return Unit.Value;
    }
}