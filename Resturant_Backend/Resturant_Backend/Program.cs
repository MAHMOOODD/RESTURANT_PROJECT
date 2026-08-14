using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using Resturant_Backend.Common.Responses;
using Resturant_Backend.Data;
using Resturant_Backend.Helpers;
using Resturant_Backend.Interfaces;
using Resturant_Backend.Middlewares;
using Resturant_Backend.Models;
using Resturant_Backend.Repository;
using Resturant_Backend.Services;
using System.Text;

namespace Resturant_Backend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            // [تعديل]: توحيد أخطاء الـ Model Validation التلقائية لترجع داخل ApiResponse الموحد
            builder.Services.AddControllers()
                .ConfigureApiBehaviorOptions(options =>
                {
                    options.InvalidModelStateResponseFactory = context =>
                    {
                        var errors = context.ModelState
                            .Where(e => e.Value != null && e.Value.Errors.Count > 0)
                            .ToDictionary(
                                kvp => char.ToLowerInvariant(kvp.Key[0]) + kvp.Key.Substring(1), // camelCase
                                kvp => kvp.Value!.Errors.Select(e => e.ErrorMessage).ToList()
                            );

                        var response = ApiResponse<object>.FailureResponse(
                            statusCode: 400,
                            message: "يرجى التأكد من صحة البيانات المدخلة.",
                            errors: errors
                        );

                        return new BadRequestObjectResult(response);
                    };
                });

            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddEndpointsApiExplorer();

            builder.Services.AddSwaggerGen(options =>
            {
                // تعريف طريقة التوثيق (JWT Bearer)
                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "ادخل التوكن بتاعك هنا مباشرة (بدون كلمة Bearer)"
                });

                // تطبيق التوثيق على كل الـ Endpoints في سواجر
                options.AddSecurityRequirement(document => new OpenApiSecurityRequirement{
                    {
                    new OpenApiSecuritySchemeReference("Bearer", document),
                    new List<string>()
                    }
                });
            });

            builder.Services.Configure<JwtHelper>(builder.Configuration.GetSection("JWT"));

            //add identity
            builder.Services.AddIdentity<Appuser, IdentityRole>(op =>
            {
                op.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
                op.Lockout.MaxFailedAccessAttempts = 3;
                op.Lockout.AllowedForNewUsers = true;

                op.Password.RequireDigit = true;
                op.Password.RequireLowercase = true;
                op.Password.RequireUppercase = true;
                op.Password.RequireNonAlphanumeric = true;
            }).AddEntityFrameworkStores<AppDbContext>().AddDefaultTokenProviders();

            builder.Services.AddAuthentication(o =>
            {
                o.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                o.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(o =>
            {
                o.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateIssuerSigningKey = true,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero,

                    ValidIssuer = builder.Configuration["JWT:Issuer"],
                    ValidAudience = builder.Configuration["JWT:Audience"],
                    IssuerSigningKey =
                    new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Key"]!))
                };
            });

            //add cors
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll",
                    builder =>
                    {
                        builder
                            .AllowAnyOrigin()
                            .AllowAnyMethod()
                            .AllowAnyHeader();
                    });
            });

            //add automapper
            builder.Services.AddAutoMapper(cfg => { },
                          typeof(Program).Assembly);

            // 1. ربط كلاس الـ EmailSettings بملف appsettings.json
            builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));

            // 2. تسجيل EmailService و AuthService
            builder.Services.AddTransient<IEmailService, EmailService>();

            // add DbContext
            builder.Services.AddDbContext<AppDbContext>(op =>
            {
                op.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
            });

            // add scoped services
            builder.Services.AddScoped<IAuthService, Authservice>();
            builder.Services.AddScoped<IUnitOfWork, UnitOfWorkRepo>();

            var app = builder.Build();

            // تسجيل الـ Middleware الموحدة للأخطاء
            app.UseMiddleware<GlobalExceptionHandlerMiddleware>();

            // Configure the HTTP request pipeline.
            if(app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseCors("AllowAll");
            app.UseHttpsRedirection();

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}