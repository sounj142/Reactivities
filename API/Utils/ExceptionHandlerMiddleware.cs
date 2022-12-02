using System.Net;
using Domain.Exceptions;

namespace API.Utils;

public class ExceptionHandlerMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlerMiddleware> _logger;
    private readonly IHostEnvironment _environment;

    public ExceptionHandlerMiddleware(
        RequestDelegate next, 
        ILogger<ExceptionHandlerMiddleware> logger,
        IHostEnvironment environment)
    {
        _next = next;
        _logger = logger;
        _environment = environment;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            var (code, content) = HandleException(ex, context);

            context.Response.ContentType = "application/json; charset=utf-8";
            context.Response.StatusCode = code;
            await context.Response.WriteAsync(content);
        }
    }

    private (int Code, string Content) HandleException(Exception exception, HttpContext context)
        => exception switch
        {
            ValidationException validationException => (
                Code: (int)HttpStatusCode.BadRequest,
                Content: DictionaryHelper.GenerateErrorContent(context, validationException.Failures)
            ),
            NotFoundException notFoundException => (
                Code: (int)HttpStatusCode.NotFound,
                Content: DictionaryHelper.GenerateErrorContent(notFoundException.ErrorCode, context, notFoundException.Message)
            ),
            FrameworkException frameworkException => (
                Code: (int)HttpStatusCode.BadRequest,
                Content: DictionaryHelper.GenerateErrorContent(frameworkException.ErrorCode, context, frameworkException.Message)
            ),
            _ => ((Func<(int Code, string Content)>)(() =>
            {
                // we expect that before throw FrameworkException and its derived exceptions, developers should write necessary logs
                // so we only need to write log for other kinds of unhandled exception
                _logger.LogError(exception, exception.Message);

                var message = _environment.IsDevelopment() ? exception.ToString() : "Server side error";
                return (
                    Code: (int)HttpStatusCode.InternalServerError,
                    Content: DictionaryHelper.GenerateErrorContent(ErrorCode.UNKNOWN_ERROR, context, message)
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