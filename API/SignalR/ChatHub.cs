using API.Utils;
using Application.Comments;
using Application.Comments.Dtos;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;

public class ChatHub : Hub
{
    private readonly IMediator _mediator;
    private readonly IValidator<CommentDto> _validator;

    public ChatHub(IMediator mediator, IValidator<CommentDto> validator)
    {
        _validator = validator;
        _mediator = mediator;
    }

    public async Task SendComment(CommentDto model)
    {
        var validatorResult = _validator.Validate(model);
        if (validatorResult.IsValid)
        {
            var comment = await _mediator.Send(new CreateCommentCommand { Comment = model });
            await Clients.Group(model.ActivityId.ToString())
                .SendAsync("CommentCreated", comment);
        }
        else
        {
            var error = ErrorResponse.Create(Context.GetHttpContext(), validatorResult.Errors);
            await Clients.Caller.SendAsync("CommentCreatingError", error);
        }
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