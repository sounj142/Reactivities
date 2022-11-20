using MediatR;
using AutoMapper;
using Domain.Repositories;
using Application.Activities.Dtos;

namespace Application.Activities;

public class GetActivitiesQuery : IRequest<ActivityDto[]> { }

public class GetActivitiesHandler : IRequestHandler<GetActivitiesQuery, ActivityDto[]>
{
    private readonly IActivityRepository _activityRepository;
    private readonly IMapper _mapper;

    public GetActivitiesHandler(
        IActivityRepository activityRepository,
        IMapper mapper)
    {
        _activityRepository = activityRepository;
        _mapper = mapper;
    }

    public async Task<ActivityDto[]> Handle(GetActivitiesQuery request, CancellationToken cancellationToken)
    {
        var activities = await _activityRepository.GetAll();
        return _mapper.Map<ActivityDto[]>(activities);
    }
}