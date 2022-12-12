using Application.Comments;
using Application.Comments.Dtos;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;

public class ChatHub : Hub
{
    private readonly IMediator _mediator;

    public ChatHub(IMediator mediator)
    {
        Console.WriteLine("----------Creating chathub!");
        _mediator = mediator;
    }

    protected override void Dispose(bool disposing)
    {
        base.Dispose(disposing);
        Console.WriteLine("----------Disposing chathub!");
    }

    public async Task SendComment(CommentDto model)
    {
        // TODO: Validator???
        var comment = await _mediator.Send(new CreateCommentCommand { Comment = model });

        await Clients.Group(model.ActivityId.ToString())
            .SendAsync("CommentCreated", comment);
    }

    public override async Task OnConnectedAsync()
    {
        var httpContext = Context.GetHttpContext();
        var activityIdStr = httpContext.Request.Query["activityId"].FirstOrDefault();
        Guid activityId;
        if (Guid.TryParse(activityIdStr, out activityId))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, activityIdStr);

            var comments = await _mediator.Send(new GetCommentsQuery { ActivityId = activityId });
            await Clients.Caller.SendAsync("LoadComments", comments);
        }
    }
}