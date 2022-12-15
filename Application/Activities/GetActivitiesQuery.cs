using MediatR;
using Domain.Repositories;
using Domain.Activities;
using Domain.Common;

namespace Application.Activities;

public class GetActivitiesQuery : PagingParams, IRequest<PagedList<ActivityWithAttendees>>
{
    public bool? IsGoing { get; set; }
    public bool? IsHost { get; set; }
    public DateTimeOffset? StartDate { get; set; } // = DateTimeOffset.Now;
}

public class GetActivitiesHandler : IRequestHandler<GetActivitiesQuery, PagedList<ActivityWithAttendees>>
{
    private readonly IActivityRepository _activityRepository;

    public GetActivitiesHandler(IActivityRepository activityRepository)
    {
        _activityRepository = activityRepository;
    }

    public async Task<PagedList<ActivityWithAttendees>> Handle(GetActivitiesQuery request, CancellationToken cancellationToken)
    {
        var activities = await _activityRepository.GetAll(
            currentPage: request.CurrentPage,
            pageSize: request.PageSize,
            isGoing: request.IsGoing,
            isHost: request.IsHost,
            startDate: request.StartDate
        );
        return activities;
    }
}