using MediatR;
using Domain.Repositories;
using Domain;

namespace Application.Activities;

public class GetActivityByIdQuery : IRequest<ActivityWithAttendees>
{
    public Guid Id { get; set; }
}

public class GetActivityByIdHandler : IRequestHandler<GetActivityByIdQuery, ActivityWithAttendees>
{
    private readonly IActivityRepository _activityRepository;

    public GetActivityByIdHandler(
        IActivityRepository activityRepository)
    {
        _activityRepository = activityRepository;
    }

    public async Task<ActivityWithAttendees> Handle(GetActivityByIdQuery request, CancellationToken cancellationToken)
    {
        var activity = await _activityRepository.GetById(id: request.Id, throwIfNotFound: true);
        return activity;
    }
}