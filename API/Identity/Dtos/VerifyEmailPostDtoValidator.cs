using FluentValidation;

namespace API.Identity.Dtos;

public class VerifyEmailPostDtoValidator : AbstractValidator<VerifyEmailPostDto>
{
    public VerifyEmailPostDtoValidator()
    {
        RuleFor(v => v.Token)
           .NotEmpty().WithMessage("Token is required.");
        RuleFor(v => v.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("Email should be a valid email address.");
    }
}
