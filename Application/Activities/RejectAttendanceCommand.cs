using Domain.Exceptions;
using Domain.Repositories;
using Domain.Services;
using MediatR;

namespace Application.Activities;

public class RejectAttendanceCommand : IRequest
{
    public Guid Id { get; set; }
}

public class RejectAttendanceCommandHandler : IRequestHandler<RejectAttendanceCommand>
{
    private readonly IActivityRepository _activityRepository;
    private readonly ICurrentUserContext _currentUserContext;

    public RejectAttendanceCommandHandler(
        IActivityRepository activityRepository,
        ICurrentUserContext currentUserContext)
    {
        _activityRepository = activityRepository;
        _currentUserContext = currentUserContext;
    }

    public async Task<Unit> Handle(RejectAttendanceCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserContext.GetCurrentUserId();
        var activity = await _activityRepository.GetById(request.Id);

        if (activity == null)
            throw new NotFoundException(ErrorCode.APP0003, "Reject activity failed. Activity is not found.");
        var attendee = activity.Attendees.FirstOrDefault(x => x.UserId == userId);
        if (attendee == null)
            throw new FrameworkException(ErrorCode.APP0004, "You have not signed in this activity.");
        if (attendee.IsHost)
            throw new FrameworkException(ErrorCode.APP0005, "You can't reject this activity because you are its host.");

        await _activityRepository.Reject(request.Id, userId);
        return Unit.Value;
    }
}