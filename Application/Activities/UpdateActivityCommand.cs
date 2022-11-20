using Application.Activities.Dtos;
using AutoMapper;
using Domain;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Activities;

public class UpdateActivityCommand : IRequest
{
    public ActivityDto Activity { get; set; }
}

public class UpdateActivityCommandHandler : IRequestHandler<UpdateActivityCommand>
{
    private readonly ILogger<UpdateActivityCommandHandler> _logger;
    private readonly IActivityRepository _activityRepository;
    private readonly IMapper _mapper;

    public UpdateActivityCommandHandler(
        ILogger<UpdateActivityCommandHandler> logger,
        IActivityRepository activityRepository,
        IMapper mapper)
    {
        _logger = logger;
        _activityRepository = activityRepository;
        _mapper = mapper;
    }

    public async Task<Unit> Handle(UpdateActivityCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Updating activity Id '{@Id}', title '{@Title}'", request.Activity.Id, request.Activity.Title);

        var activity = _mapper.Map<Activity>(request.Activity);
        await _activityRepository.Update(activity);
        return Unit.Value;
    }
}