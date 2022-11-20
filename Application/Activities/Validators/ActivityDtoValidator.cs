using FluentValidation;
using Application.Activities.Dtos;

namespace Application.Activities.Validators;
public class ActivityDtoValidator : AbstractValidator<ActivityDto>
{
    public ActivityDtoValidator()
    {
        RuleFor(v => v.Id)
            .NotEmpty().WithMessage("Id is required.");

        RuleFor(v => v.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(200).WithMessage("Title must not exceed 200 characters.");

        RuleFor(v => v.Description)
            .MaximumLength(1000).WithMessage("Description must not exceed 1000 characters.");
    }
}