using Application.Activities.Dtos;
using AutoMapper;
using Domain;
using Domain.Repositories;
using Domain.Services;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Activities;

public class CreateActivityCommand : IRequest
{
    public ActivityDto Activity { get; set; }
}

public class CreateActivityCommandHandler : IRequestHandler<CreateActivityCommand>
{
    private readonly ILogger<CreateActivityCommandHandler> _logger;
    private readonly IActivityRepository _activityRepository;
    private readonly IMapper _mapper;
    private readonly ICurrentUserContext _currentUserContext;

    public CreateActivityCommandHandler(
        ILogger<CreateActivityCommandHandler> logger,
        IActivityRepository activityRepository,
        IMapper mapper,
        ICurrentUserContext currentUserContext)
    {
        _logger = logger;
        _activityRepository = activityRepository;
        _mapper = mapper;
        _currentUserContext = currentUserContext;
    }

    public async Task<Unit> Handle(CreateActivityCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Creating activity Id '{@Id}', title '{@Title}'", request.Activity.Id, request.Activity.Title);

        var activity = _mapper.Map<Activity>(request.Activity);
        await _activityRepository.Create(activity, _currentUserContext.GetCurrentUserId(), DateTimeOffset.Now);
        return Unit.Value;
    }
}