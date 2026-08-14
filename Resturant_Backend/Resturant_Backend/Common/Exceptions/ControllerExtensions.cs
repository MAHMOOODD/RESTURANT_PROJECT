
using Microsoft.AspNetCore.Mvc;
using Resturant_Backend.Common.Responses;
using System.Diagnostics.CodeAnalysis;
namespace Resturant_Backend.Common.Exceptions

{


    public static class ControllerExtensions
    {
        [DoesNotReturn]
        public static void BadRequestEx(this ControllerBase controller, string message)
            => throw new BadRequestException(message);

        [DoesNotReturn]
        public static void NotFoundEx(this ControllerBase controller, string message)
            => throw new NotFoundException(message);

        [DoesNotReturn]
        public static void UnauthorizedEx(this ControllerBase controller, string message = "غير مصرح لك بالوصول.")
            => throw new UnauthorizedException(message);

        [DoesNotReturn]
        public static void ForbiddenEx(this ControllerBase controller, string message = "ليس لديك صلاحية.")
            => throw new ForbiddenException(message);

        [DoesNotReturn]
        public static void ConflictEx(this ControllerBase controller, string message)
            => throw new ConflictException(message);
        public static IActionResult Success<T>(this ControllerBase controller, T data)
        => controller.Ok(ApiResponse<T>.SuccessResponse(data));

        public static IActionResult SuccessMessage(this ControllerBase controller, string message)
            => controller.Ok(ApiResponse<string>.SuccessResponse(message));
    }
}

