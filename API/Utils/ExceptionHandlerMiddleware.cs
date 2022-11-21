using System.Net;
using System.Text.Json;
using Domain.Exceptions;

namespace API.Utils;

public class ExceptionHandlerMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlerMiddleware> _logger;
    private readonly IWebHostEnvironment _environment;

    public ExceptionHandlerMiddleware(RequestDelegate next, ILogger<ExceptionHandlerMiddleware> logger, IWebHostEnvironment environment)
    {
        _next = next;
        _logger = logger;
        _environment = environment;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            var (code, content) = HandleException(ex);

            context.Response.ContentType = "application/json; charset=utf-8";
            context.Response.StatusCode = code;
            await context.Response.WriteAsync(content);
        }
    }

    private (int Code, string Content) HandleException(Exception exception)
        => exception switch
        {
            ValidationException validationException => (
                Code: (int)HttpStatusCode.BadRequest,
                Content: JsonSerializer.Serialize(validationException.Failures)
            ),
            NotFoundException notFoundException => (
                Code: (int)HttpStatusCode.NotFound,
                Content: JsonSerializer.Serialize(DictionaryHelper.CreateErrorObject(notFoundException.ErrorCode, notFoundException.Message))
            ),
            FrameworkException frameworkException => (
                Code: (int)HttpStatusCode.BadRequest,
                Content: JsonSerializer.Serialize(DictionaryHelper.CreateErrorObject(frameworkException.ErrorCode, frameworkException.Message))
            ),
            _ => ((Func<(int Code, string Content)>)(() =>
            {
                // we expect that before throw FrameworkException and its derived exceptions, developers should write necessary logs
                // so we only need to write log for other kinds of unhandled exception
                _logger.LogError(exception, exception.Message);

                var message = _environment.IsDevelopment() ? exception.Message : "Unknown error";

                return (
                    Code: (int)HttpStatusCode.InternalServerError,
                    Content: JsonSerializer.Serialize(DictionaryHelper.CreateErrorObject("UNKNOWN_ERROR", message))
                );
            }))()
        };
}

public static class ExceptionHandlerMiddlewareExtensions
{
    public static IApplicationBuilder UseCustomExceptionHandler(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<ExceptionHandlerMiddleware>();
    }
}