using Resturant_Backend.Common.Exceptions;
using System.Diagnostics.CodeAnalysis;
using System.Linq.Expressions;
using System.Runtime.CompilerServices;

namespace Resturant_Backend.Common.Helpers
{
    public static class Ensure
    {
        // 1. الفحص الشرطي المباشر مع استخراج اسم الشرط تلقائياً لو الرسالة فاضية
        public static void Check(
            bool condition,
            string message,
            [CallerArgumentExpression(nameof(condition))] string? paramName = null)
        {
            if(condition)
                throw new BadRequestException(string.IsNullOrWhiteSpace(message) ? $"Condition failed: {paramName}" : message);
        }

        // 2. التحقق من الـ Null وإرجاع NotFound
        public static void NotNull(
            [NotNull] object? value,
            string message,
            [CallerArgumentExpression(nameof(value))] string? paramName = null)
        {
            if(value is null)
                throw new NotFoundException(string.IsNullOrWhiteSpace(message) ? $"{paramName} was not found." : message);
        }

        // 3. التحقق من النصوص (ليست Null أو فاضية)
        public static void NotNullOrEmpty(
            [NotNull] string? value,
            string message,
            [CallerArgumentExpression(nameof(value))] string? paramName = null)
        {
            if(string.IsNullOrEmpty(value))
                throw new BadRequestException(string.IsNullOrWhiteSpace(message) ? $"{paramName} cannot be null or empty." : message);
        }

        // 4. التحقق من الـ Null للـ Authentication وإرجاع Unauthorized
        public static void Unauthorized(
            [NotNull] object? value,
            string message = "غير مصرح لك بالوصول.")
        {
            if(value is null)
                throw new UnauthorizedException(message);
        }

        // 5. رمي الاستثناءات المباشرة (Direct Exception Throwers)
        [DoesNotReturn]
        public static void BadRequest(string message)
            => throw new BadRequestException(message);

        [DoesNotReturn]
        public static void Forbidden(string message = "ليس لديك صلاحية.")
            => throw new ForbiddenException(message);

        [DoesNotReturn]
        public static void Conflict(string message)
            => throw new ConflictException(message);

        // 6. أخطاء الـ Validation للحقول (Field Errors)
        public static void FieldError(string fieldName, string errorMessage, string mainMessage = "خطأ في البيانات المدخلة.")
        {
            var errors = new Dictionary<string, List<string>>
            {
                { fieldName, new List<string> { errorMessage } }
            };
            throw new ValidationException(errors, mainMessage);
        }

        // 7. Strongly-Typed Field Error باستخدام ה- Expression
        public static void FieldError<TModel, TProperty>(
            Expression<Func<TModel, TProperty>> propertyLambda,
            string errorMessage,
            string mainMessage = "خطأ في البيانات المدخلة.")
        {
            var member = propertyLambda.Body as MemberExpression;
            if(member is null)
            {
                if(propertyLambda.Body is UnaryExpression unary && unary.Operand is MemberExpression unaryMember)
                {
                    member = unaryMember;
                }
                else
                {
                    throw new ArgumentException("Expression must refer to a property.");
                }
            }

            string propertyName = member.Member.Name;
            string camelCaseName = char.ToLowerInvariant(propertyName[0]) + propertyName.Substring(1);

            FieldError(camelCaseName, errorMessage, mainMessage);
        }

        // 8. رمي مجموعة أخطاء للفيلدز دفعة واحدة
        public static void Validation(IDictionary<string, List<string>> errors, string mainMessage = "خطأ في البيانات المدخلة.")
        {
            throw new ValidationException(errors, mainMessage);
        }
    }
}