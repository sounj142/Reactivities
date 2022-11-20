using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Activities;

public class DeleteActivityCommand : IRequest
{
    public Guid Id { get; set; }
}

public class DeleteActivityCommandHandler : IRequestHandler<DeleteActivityCommand>
{
    private readonly ILogger<DeleteActivityCommandHandler> _logger;
    private readonly IActivityRepository _activityRepository;

    public DeleteActivityCommandHandler(
        ILogger<DeleteActivityCommandHandler> logger,
        IActivityRepository activityRepository)
    {
        _logger = logger;
        _activityRepository = activityRepository;
    }

    public async Task<Unit> Handle(DeleteActivityCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Deleting activity Id '{@Id}'", request.Id);

        await _activityRepository.Delete(request.Id);
        return Unit.Value;
    }
}