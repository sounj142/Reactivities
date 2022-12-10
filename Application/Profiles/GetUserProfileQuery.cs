using MediatR;
using Domain.Repositories;
using Domain.Photos;
using Domain.Exceptions;

namespace Application.Profiles;

public class GetUserProfileQuery : IRequest<UserProfileFullInfo>
{
    public string UserName { get; set; }
}

public class GetUserProfileHandler : IRequestHandler<GetUserProfileQuery, UserProfileFullInfo>
{
    private readonly IProfileRepository _profileRepository;

    public GetUserProfileHandler(IProfileRepository profileRepository)
    {
        _profileRepository = profileRepository;
    }

    public async Task<UserProfileFullInfo> Handle(GetUserProfileQuery request, CancellationToken cancellationToken)
    {
        var user = await _profileRepository.GetUserProfileByUserName(request.UserName);
        if (user == null)
            throw new NotFoundException(ErrorCode.APP0022, "User not found.");
        return user;
    }
}