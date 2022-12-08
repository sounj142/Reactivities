using Application.Activities;
using Application.Activities.Dtos;
using Domain;
using Domain.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ActivitiesController : BaseApiController
{
    [HttpGet]
    public async Task<IList<ActivityWithAttendees>> Get()
    {
        return await Mediator.Send(new GetActivitiesQuery());
    }

    [HttpGet("{id}")]
    public async Task<ActivityWithAttendees> Get(Guid id)
    {
        return await Mediator.Send(new GetActivityByIdQuery { Id = id });
    }

    [HttpPost]
    public async Task<ActionResult> Create(ActivityDto activity)
    {
        await Mediator.Send(new CreateActivityCommand { Activity = activity });
        return Ok();
    }

    [HttpPost("{id}/signin")]
    public async Task<ActionResult> SignIn(Guid id)
    {
        await Mediator.Send(new SignInActivityCommand { Id = id });
        return Ok();
    }

    [HttpPost("{id}/reject")]
    public async Task<ActionResult> Reject(Guid id)
    {
        await Mediator.Send(new RejectActivityCommand { Id = id });
        return Ok();
    }

    [HttpPost("{id}/cancel")]
    public async Task<ActionResult> Cancel(Guid id)
    {
        await Mediator.Send(new CancelActivityCommand { Id = id });
        return Ok();
    }

    [HttpPost("{id}/reactivate")]
    public async Task<ActionResult> Reactivate(Guid id)
    {
        await Mediator.Send(new ReactivateActivityCommand { Id = id });
        return Ok();
    }

    [HttpPut]
    public async Task<ActionResult> Update(ActivityDto activity)
    {
        await Mediator.Send(new UpdateActivityCommand { Activity = activity });
        return Ok();
    }
}
