using Domain.Exceptions;
using Domain.Repositories;
using Domain.Services;
using MediatR;

namespace Application.Activities;

public class SignInActivityCommand : IRequest
{
    public Guid Id { get; set; }
}

public class SignInActivityCommandHandler : IRequestHandler<SignInActivityCommand>
{
    private readonly IActivityRepository _activityRepository;
    private readonly ICurrentUserContext _currentUserContext;

    public SignInActivityCommandHandler(
        IActivityRepository activityRepository,
        ICurrentUserContext currentUserContext)
    {
        _activityRepository = activityRepository;
        _currentUserContext = currentUserContext;
    }

    public async Task<Unit> Handle(SignInActivityCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserContext.GetCurrentUserId();
        var activity = await _activityRepository.GetById(request.Id);

        if (activity == null)
            throw new NotFoundException(ErrorCode.APP0001, "Attendance rejected. Activity is not found.");
        if (activity.Attendees.Any(x => x.UserId == userId))
            throw new FrameworkException(ErrorCode.APP0002, "You have already signed in this activity.");

        await _activityRepository.SignIn(request.Id, userId, DateTimeOffset.Now); 
        return Unit.Value;
    }
}