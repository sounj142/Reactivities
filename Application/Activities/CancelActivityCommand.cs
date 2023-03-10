using Domain.Exceptions;
using Domain.Repositories;
using Domain.Services;
using MediatR;

namespace Application.Activities;

public class CancelActivityCommand : IRequest
{
    public Guid Id { get; set; }
}

public class CancelActivityCommandHandler : IRequestHandler<CancelActivityCommand>
{
    private readonly IActivityRepository _activityRepository;
    private readonly ICurrentUserContext _currentUserContext;

    public CancelActivityCommandHandler(
        IActivityRepository activityRepository,
        ICurrentUserContext currentUserContext)
    {
        _activityRepository = activityRepository;
        _currentUserContext = currentUserContext;
    }

    public async Task<Unit> Handle(CancelActivityCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserContext.GetCurrentUserId();
        var activity = await _activityRepository.GetById(request.Id);

        if (activity == null)
            throw new NotFoundException(ErrorCode.APP0006, "Cancellation rejected. Activity is not found.");
        var attendee = activity.Attendees.FirstOrDefault(x => x.UserId == userId);
        if (attendee == null || !attendee.IsHost)
            throw new FrameworkException(ErrorCode.APP0008, "You can't cancel this activity because you aren't its host.");
        if (activity.IsCancelled)
            throw new FrameworkException(ErrorCode.APP0010, "Activity has already canceled.");

        await _activityRepository.Cancel(request.Id);
        return Unit.Value;
    }
}