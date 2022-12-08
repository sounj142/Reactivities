using MediatR;
using Domain.Repositories;
using Domain;

namespace Application.Activities;

public class GetActivitiesQuery : IRequest<IList<ActivityWithAttendees>> { }

public class GetActivitiesHandler : IRequestHandler<GetActivitiesQuery, IList<ActivityWithAttendees>>
{
    private readonly IActivityRepository _activityRepository;

    public GetActivitiesHandler(IActivityRepository activityRepository)
    {
        _activityRepository = activityRepository;
    }

    public async Task<IList<ActivityWithAttendees>> Handle(GetActivitiesQuery request, CancellationToken cancellationToken)
    {
        var activities = await _activityRepository.GetAll();
        return activities;
    }
}