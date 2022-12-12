using API.Utils;
using Domain.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public abstract class BaseApiController : ControllerBase
{
    private IMediator _mediator;

    protected IMediator Mediator
        => _mediator ??= HttpContext.RequestServices.GetService<IMediator>();

    protected Guid ParseGuid(string id)
    {
        Guid result;
        if (Guid.TryParse(id, out result))
            return result;
        throw new NotFoundException(ErrorCode.INVALID_GUID, "Not Found.");
    }
}