using Domain.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[AllowAnonymous]
public class BuggyController : BaseApiController
{
    [HttpGet("not-found")]
    public ActionResult GetNotFound()
    {
        throw new NotFoundException("_NOT_FOUND", "This is a not found exception.");
    }

    [HttpGet("default-not-found")]
    public ActionResult GetDefaultNotFound()
    {
        return NotFound();
    }

    [HttpGet("bad-request")]
    public ActionResult GetBadRequest()
    {
        throw new FrameworkException("_BAD_REQUEST", "This is a bad request");
    }

    [HttpGet("default-bad-request")]
    public ActionResult GetDefaultBadRequest()
    {
        return BadRequest();
    }

    [HttpGet("server-error")]
    public ActionResult GetServerError()
    {
        throw new Exception("This is a server error");
    }

    [HttpGet("unauthorised")]
    public ActionResult GetUnauthorised()
    {
        return Unauthorized();
    }

    // [HttpGet("unauthenticated")]
    // [Microsoft.AspNetCore.Authorization.Authorize]
    // public ActionResult GetUnauthenticated()
    // {
    //     return Ok();
    // }
}
