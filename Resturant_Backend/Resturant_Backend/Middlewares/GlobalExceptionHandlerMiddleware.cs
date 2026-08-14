using Resturant_Backend.Common.Exceptions;
using Resturant_Backend.Common.Responses;
using System.Net;
using System.Text.Json;

namespace Resturant_Backend.Middlewares;

public class GlobalExceptionHandlerMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionHandlerMiddleware> _logger;

    public GlobalExceptionHandlerMiddleware(RequestDelegate next, ILogger<GlobalExceptionHandlerMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);

            // التقاط 401 و 403 القادمة من الـ Framework مباشرة (مثل [Authorize])
            if(context.Response.StatusCode == (int)HttpStatusCode.Unauthorized && !context.Response.HasStarted)
            {
                await WriteCustomResponseAsync(context, 401, "غير مصرح لك بالوصول، يرجى تسجيل الدخول.");
            }
            else if(context.Response.StatusCode == (int)HttpStatusCode.Forbidden && !context.Response.HasStarted)
            {
                await WriteCustomResponseAsync(context, 403, "ليس لديك صلاحية للوصول لهذا المورد.");
            }
        }
        catch(Exception ex)
        {
            _logger.LogError(ex, ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        int statusCode = (int)HttpStatusCode.InternalServerError;
        string message = "حدث خطأ غير متوقع في السيرفر.";
        IDictionary<string, List<string>>? errors = null;

        if(exception is ValidationException valEx)
        {
            statusCode = valEx.StatusCode;
            message = valEx.Message;
            errors = valEx.ValidationErrors;
        }
        else if(exception is AppException appEx)
        {
            statusCode = appEx.StatusCode;
            message = appEx.Message;
        }

        return WriteCustomResponseAsync(context, statusCode, message, errors);
    }

    private static Task WriteCustomResponseAsync(HttpContext context, int statusCode, string message, IDictionary<string, List<string>>? errors = null)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = statusCode;

        var response = ApiResponse<object>.FailureResponse(statusCode, message, errors);

        var jsonOptions = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
        var json = JsonSerializer.Serialize(response, jsonOptions);

        return context.Response.WriteAsync(json);
    }
}