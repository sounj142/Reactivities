using FluentValidation;

namespace API.Identity.Dtos;

public class ChangePasswordDtoValidator : AbstractValidator<ChangePasswordDto>
{
    public ChangePasswordDtoValidator()
    {
        RuleFor(v => v.NewPassword)
            .NotEmpty().WithMessage("New password is required.")
            .MinimumLength(6).WithMessage("New password must have at least 6 characters.")
            .MaximumLength(100).WithMessage("New password must not exceed 100 characters.")
            .Must((obj, value) =>
                string.IsNullOrEmpty(obj.NewPassword) ||
                string.IsNullOrEmpty(obj.CurrentPassword) ||
                obj.NewPassword != obj.CurrentPassword
            )
            .WithMessage("New password must be different from current password.");
    }
}
