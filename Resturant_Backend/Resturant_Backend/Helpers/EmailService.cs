using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using Resturant_Backend.Helpers;

namespace Resturant_Backend.Services;

public class EmailService : IEmailService
{
    private readonly EmailSettings _emailSettings;

    public EmailService(IOptions<EmailSettings> emailSettings)
    {
        _emailSettings = emailSettings.Value;
    }

    public async Task SendEmailAsync(string mailTo, string subject, string body)
    {
        var email = new MimeMessage();

        // 1. تحديد بيانات الراسل
        email.Sender = MailboxAddress.Parse(_emailSettings.Email);
        email.From.Add(new MailboxAddress(_emailSettings.DisplayName, _emailSettings.Email));

        // 2. تحديد المستلم والعنوان
        email.To.Add(MailboxAddress.Parse(mailTo));
        email.Subject = subject;

        // 3. بناء محتوى الرسالة بـ HTML
        var builder = new BodyBuilder
        {
            HtmlBody = body
        };
        email.Body = builder.ToMessageBody();

        // 4. الاتصال بسيرفر Gmail والإرسال
        using var smtp = new MailKit.Net.Smtp.SmtpClient();

        await smtp.ConnectAsync(_emailSettings.Host, _emailSettings.Port, SecureSocketOptions.StartTls);
        await smtp.AuthenticateAsync(_emailSettings.Email, _emailSettings.Password);
        await smtp.SendAsync(email);
        await smtp.DisconnectAsync(true);
    }
}