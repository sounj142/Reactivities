using Domain.Exceptions;
using Domain.Repositories;
using Domain.Services;
using MediatR;

namespace Application.Activities;

public class ReactivateActivityCommand : IRequest
{
    public Guid Id { get; set; }
}

public class ReactivateActivityCommandHandler : IRequestHandler<ReactivateActivityCommand>
{
    private readonly IActivityRepository _activityRepository;
    private readonly ICurrentUserContext _currentUserContext;

    public ReactivateActivityCommandHandler(
        IActivityRepository activityRepository,
        ICurrentUserContext currentUserContext)
    {
        _activityRepository = activityRepository;
        _currentUserContext = currentUserContext;
    }

    public async Task<Unit> Handle(ReactivateActivityCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserContext.GetCurrentUserId();
        var activity = await _activityRepository.GetById(request.Id);

        if (activity == null)
            throw new NotFoundException(ErrorCode.APP0011, "Reactivation rejected. Activity is not found.");
        var attendee = activity.Attendees.FirstOrDefault(x => x.UserId == userId);
        if (attendee == null || !attendee.IsHost)
            throw new FrameworkException(ErrorCode.APP0013, "You can't cancel this activity because you aren't its host.");
        if (!activity.IsCancelled)
            throw new FrameworkException(ErrorCode.APP0014, "Reactivation rejected. Activity is still active.");

        await _activityRepository.Reactivate(request.Id);
        return Unit.Value;
    }
}