using Application.Activities;
using Application.Activities.Dtos;
using Domain.Activities;
using Domain.Common;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ActivitiesController : BaseApiController
{
    [HttpGet]
    public async Task<PagedList<ActivityWithAttendees>> Get([FromQuery] GetActivitiesQuery query)
    {
        return await Mediator.Send(query);
    }

    [HttpGet("{id}")]
    public async Task<ActivityWithAttendees> Get(string id)
    {
        return await Mediator.Send(new GetActivityByIdQuery { Id = ParseGuid(id) });
    }

    [HttpPost]
    public async Task<ActionResult<ActivityWithAttendees>> Create(ActivityDto activity)
    {
        var result = await Mediator.Send(new CreateActivityCommand { Activity = activity });
        return Ok(result);
    }

    [HttpPut]
    public async Task<ActionResult<ActivityWithAttendees>> Update(ActivityDto activity)
    {
        var result = await Mediator.Send(new UpdateActivityCommand { Activity = activity });
        return Ok(result);
    }

    [HttpPost("{id}/accept")]
    public async Task<ActionResult<AttendeeWithFollowInfo>> Accept(string id)
    {
        var atendee = await Mediator.Send(new AcceptActivityCommand { Id = ParseGuid(id) });
        return Ok(atendee);
    }

    [HttpPost("{id}/reject")]
    public async Task<ActionResult> Reject(string id)
    {
        await Mediator.Send(new RejectAttendanceCommand { Id = ParseGuid(id) });
        return Ok();
    }

    [HttpPost("{id}/cancel")]
    public async Task<ActionResult> Cancel(string id)
    {
        await Mediator.Send(new CancelActivityCommand { Id = ParseGuid(id) });
        return Ok();
    }

    [HttpPost("{id}/reactivate")]
    public async Task<ActionResult> Reactivate(string id)
    {
        await Mediator.Send(new ReactivateActivityCommand { Id = ParseGuid(id) });
        return Ok();
    }
}
