using Application.Activities;
using Application.Photos;
using Application.Profiles;
using Application.Profiles.Dtos;
using Domain.Photos;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ProfilesController : BaseApiController
{
    [HttpPost("upload-photo")]
    public async Task<ActionResult<Photo>> UploadPhoto([FromForm] IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("Image should not be an empty file.");

        using var stream = file.OpenReadStream();

        var result = await Mediator.Send(new UploadPhotoCommand
        {
            FileStream = stream,
            FileLength = file.Length,
            FileName = file.FileName
        });
        return result;
    }

    [HttpDelete("delete-photo/{photoId}")]
    public async Task<ActionResult> DeletePhoto(string photoId)
    {
        await Mediator.Send(new DeletePhotoCommand { Id = photoId });
        return Ok();
    }

    [HttpPut("set-main-photo/{photoId}")]
    public async Task<ActionResult> SetMainPhoto(string photoId)
    {
        await Mediator.Send(new SetMainPhotoCommand { Id = photoId });
        return Ok();
    }

    [HttpGet("{userName}")]
    public async Task<ActionResult<UserProfileFullInfo>> GetProfile(string userName)
    {
        return Ok(await Mediator.Send(new GetUserProfileQuery { UserName = userName }));
    }

    [HttpPost("update-about")]
    public async Task<ActionResult> UpdateProfileAbout(UserAboutDto model)
    {
        await Mediator.Send(new UpdateUserAboutCommand { About = model });
        return Ok();
    }
}
