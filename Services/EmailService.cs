using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SendGrid;
using SendGrid.Helpers.Mail;


namespace CafApi.Services
{
    public class EmailService : IEmailService
    {
        private readonly ISendGridClient _client;
        private readonly EmailAddress _fromAddress;
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(ISendGridClient client, IConfiguration configuration, ILogger<EmailService> logger)
        {
            _client = client;
            _fromAddress = new EmailAddress("info@interviewer.space", "Interviewer.Space");
            _configuration = configuration;
            _logger = logger;
        }

        public async Task SendNewInterviewInvitation(string toEmail, string interviewerName, string candidateName, DateTime interviewDateTime, string interviewId, string timezone)
        {
            try
            {
                var to = new EmailAddress(toEmail);

                if (!string.IsNullOrWhiteSpace(timezone))
                {
                    if (interviewDateTime.Kind != DateTimeKind.Utc)
                    {
                        interviewDateTime = interviewDateTime.ToUniversalTime();
                    }

                    TimeZoneInfo tzi = TimeZoneInfo.FindSystemTimeZoneById(timezone);
                    interviewDateTime = TimeZoneInfo.ConvertTimeFromUtc(interviewDateTime, tzi);
                }

                dynamic templateData = new
                {
                    candidateName = candidateName,
                    interviewerName = !interviewerName.Equals(toEmail) ? interviewerName : "there",
                    interviewDate = interviewDateTime.ToString("d"),
                    interviewTime = $"{interviewDateTime.ToString("t")} ({timezone ?? "UTC"})",
                    interviewScorecard = $"https://app.interviewer.space/interviews/scorecard/{interviewId}"
                };

                var templateId = _configuration["EmailTemplates:ScheduleInterview"];
                var message = MailHelper.CreateSingleTemplateEmail(_fromAddress, to, templateId, templateData);

                var response = await _client.SendEmailAsync(message).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                _logger.LogError("Error sending email SendNewInterviewInvitation", ex);
            }
        }
    }
}