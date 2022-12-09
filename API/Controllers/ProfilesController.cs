using Application.Activities;
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
}
