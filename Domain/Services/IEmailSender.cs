namespace Domain.Services;

public interface IEmailSender
{
    Task SendEmail(string to, string subject, string content);
}