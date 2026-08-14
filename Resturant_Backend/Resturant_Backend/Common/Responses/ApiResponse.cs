namespace Resturant_Backend.Common.Responses
{

    public class ApiResponse<T>
    {
        public bool IsSuccess { get; set; }
        public T? Data { get; set; }
        public ApiError? Error { get; set; }

        public static ApiResponse<T> SuccessResponse(T data)
        {
            return new ApiResponse<T>
            {
                IsSuccess = true,
                Data = data,
                Error = null
            };
        }

        public static ApiResponse<T> FailureResponse(int statusCode, string message, IDictionary<string, List<string>>? errors = null)
        {
            return new ApiResponse<T>
            {
                IsSuccess = false,
                Data = default,
                Error = new ApiError(statusCode, message, errors)
            };
        }
    }
}
