using Domain.Services;
using Microsoft.Extensions.Configuration;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace EmailServices;

public class EmailSender : IEmailSender
{
    private readonly IConfiguration _configuration;

    public EmailSender(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task SendEmail(string to, string subject, string content)
    {
        var emailClient = new SendGridClient(_configuration["SendGrid:ApiKey"]);
        var message = new SendGridMessage
        {
            From = new EmailAddress(
                _configuration["SendGrid:FromEmail"],
                _configuration["SendGrid:FromName"]),
            Subject = subject,
            HtmlContent = content
        };
        message.AddTo(to);
        message.SetClickTracking(false, false);

        await emailClient.SendEmailAsync(message);
    }
}