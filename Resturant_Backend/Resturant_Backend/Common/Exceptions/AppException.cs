namespace Resturant_Backend.Common.Exceptions;

// 1. Base Class
public class AppException : Exception
{
    public int StatusCode { get; }

    public AppException(string message, int statusCode = 400)
        : base(message)
    {
        StatusCode = statusCode;
    }
}

// 2. 400 Bad Request
public class BadRequestException : AppException
{
    public BadRequestException(string message)
        : base(message, statusCode: 400) { }
}

// 3. 401 Unauthorized
public class UnauthorizedException : AppException
{
    public UnauthorizedException(string message = "غير مصرح لك بالوصول، يرجى تسجيل الدخول أولاً.")
        : base(message, statusCode: 401) { }
}

// 4. 403 Forbidden
public class ForbiddenException : AppException
{
    public ForbiddenException(string message = "ليس لديك الصلاحيات الكافية لإتمام هذا الإجراء.")
        : base(message, statusCode: 403) { }
}

// 5. 404 Not Found
public class NotFoundException : AppException
{
    public NotFoundException(string message)
        : base(message, statusCode: 404) { }
}

// 6. 409 Conflict
public class ConflictException : AppException
{
    public ConflictException(string message)
        : base(message, statusCode: 409) { }
}

// 7. 400 / 422 Validation Exception (أخطاء الفيلدز)
public class ValidationException : AppException
{
    public IDictionary<string, List<string>> ValidationErrors { get; }

    public ValidationException(IDictionary<string, List<string>> errors, string message = "حدثت أخطاء في البيانات المدخلة.")
        : base(message, statusCode: 400)
    {
        ValidationErrors = errors;
    }
}