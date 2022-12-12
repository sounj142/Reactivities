using FluentValidation;

namespace Application.Comments.Dtos;

public class CommentDtoValidator : AbstractValidator<CommentDto>
{
    public CommentDtoValidator()
    {
        RuleFor(v => v.Body)
            .NotEmpty().WithMessage("Body is required.")
            .MaximumLength(10000).WithMessage("Body must not exceed 10000 characters.");

        RuleFor(v => v.ActivityId)
            .NotEmpty().WithMessage("Activity Id is required.");
    }
}