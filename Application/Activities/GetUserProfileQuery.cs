using MediatR;
using Domain.Repositories;
using Domain.Exceptions;
using Domain.Activities;

namespace Application.Activities;

public class GetActivitiesOfUserQuery : IRequest<IList<ActivityMinimumInfo>>
{
    public string UserName { get; set; }
    public ActivityFilterPredicateType Predicate { get; set; }
}

public class GetActivitiesOfUserHandler : IRequestHandler<GetActivitiesOfUserQuery, IList<ActivityMinimumInfo>>
{
    private readonly IActivityRepository _activityRepository;
    private readonly IProfileRepository _profileRepository;

    public GetActivitiesOfUserHandler(
        IActivityRepository activityRepository,
        IProfileRepository profileRepository)
    {
        _activityRepository = activityRepository;
        _profileRepository = profileRepository;
    }

    public async Task<IList<ActivityMinimumInfo>> Handle(GetActivitiesOfUserQuery request, CancellationToken cancellationToken)
    {
        var user = await _profileRepository.GetUserProfileByUserName(request.UserName);
        if (user == null)
            throw new NotFoundException(ErrorCode.APP0026, "User does not exist.");

        return await _activityRepository.GetActivitiesOfUser(user.Id, request.Predicate);
    }
}