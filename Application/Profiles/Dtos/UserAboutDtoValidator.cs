using FluentValidation;

namespace Application.Profiles.Dtos;

public class UserAboutDtoValidator : AbstractValidator<UserAboutDto>
{
    public UserAboutDtoValidator()
    {
        RuleFor(v => v.DisplayName)
            .NotEmpty().WithMessage("Display name is required.")
            .MaximumLength(200).WithMessage("Display name must not exceed 200 characters.");

        RuleFor(v => v.Bio)
            .MaximumLength(10000).WithMessage("Bio must not exceed 10000 characters.");
    }
}