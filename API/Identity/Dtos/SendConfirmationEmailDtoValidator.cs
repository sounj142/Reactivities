using FluentValidation;

namespace API.Identity.Dtos;

public class SendConfirmationEmailDtoValidator : AbstractValidator<SendConfirmationEmailDto>
{
    public SendConfirmationEmailDtoValidator()
    {
        RuleFor(v => v.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("Email should be a valid email address.");
    }
}
