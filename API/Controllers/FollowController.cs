using Application.Followers;
using Application.Followers.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class FollowController : BaseApiController
{
    [HttpPost]
    public async Task<ActionResult<FollowOrUnfollowResultDto>> FollowOrUnfollow(FollowOrUnfollowCommand command)
    {
        return await Mediator.Send(command);
    }
}
