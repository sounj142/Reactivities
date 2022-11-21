using Application.Activities;
using Application.Activities.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ActivitiesController : BaseApiController
{
    [HttpGet]
    public async Task<ActivityDto[]> Get()
    {
        return await Mediator.Send(new GetActivitiesQuery());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ActivityDto>> Get(Guid id)
    {
        var activity = await Mediator.Send(new GetActivityByIdQuery { Id = id });
        return new JsonResult(activity);
    }

    [HttpPost]
    public async Task<ActionResult> Create(ActivityDto activity)
    {
        await Mediator.Send(new CreateActivityCommand { Activity = activity });
        return Ok();
    }

    [HttpPut]
    public async Task<ActionResult> Update(ActivityDto activity)
    {
        await Mediator.Send(new UpdateActivityCommand { Activity = activity });
        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        await Mediator.Send(new DeleteActivityCommand { Id = id });
        return Ok();
    }
}
