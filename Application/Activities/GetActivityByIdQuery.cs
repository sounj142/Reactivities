using MediatR;
using AutoMapper;
using Domain.Repositories;
using Application.Activities.Dtos;

namespace Application.Activities;

public class GetActivityByIdQuery : IRequest<ActivityDto>
{
    public Guid Id { get; set; }
}

public class GetActivityByIdHandler : IRequestHandler<GetActivityByIdQuery, ActivityDto>
{
    private readonly IActivityRepository _activityRepository;
    private readonly IMapper _mapper;

    public GetActivityByIdHandler(
        IActivityRepository activityRepository,
        IMapper mapper)
    {
        _activityRepository = activityRepository;
        _mapper = mapper;
    }

    public async Task<ActivityDto> Handle(GetActivityByIdQuery request, CancellationToken cancellationToken)
    {
        var activity = await _activityRepository.GetById(request.Id);
        return _mapper.Map<ActivityDto>(activity);
    }
}