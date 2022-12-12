using Domain.Activities;
using Domain.Exceptions;
using Domain.Repositories;
using Domain.Services;
using MediatR;

namespace Application.Activities;

public class AcceptActivityCommand : IRequest<Attendee>
{
    public Guid Id { get; set; }
}

public class AcceptActivityCommandHandler : IRequestHandler<AcceptActivityCommand, Attendee>
{
    private readonly IActivityRepository _activityRepository;
    private readonly ICurrentUserContext _currentUserContext;

    public AcceptActivityCommandHandler(
        IActivityRepository activityRepository,
        ICurrentUserContext currentUserContext)
    {
        _activityRepository = activityRepository;
        _currentUserContext = currentUserContext;
    }

    public async Task<Attendee> Handle(AcceptActivityCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserContext.GetCurrentUserId();
        var activity = await _activityRepository.GetById(request.Id);

        if (activity == null)
            throw new NotFoundException(ErrorCode.APP0001, "Attendance rejected. Activity is not found.");
        if (activity.Attendees.Any(x => x.UserId == userId))
            throw new FrameworkException(ErrorCode.APP0002, "You have already signed in this activity.");
        if (activity.IsCancelled)
            throw new FrameworkException(ErrorCode.APP0007, "Attendance rejected. Activity has already canceled.");

        var attendee = await _activityRepository.Accept(request.Id, userId, _currentUserContext.GetClientNow());
        return attendee;
    }
}