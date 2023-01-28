using System;
using System.Text;
using System.Threading.Tasks;
using CafApi.Common;
using CafApi.Services.Email;
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
        private readonly string _appHostUri;

        public EmailService(ISendGridClient client, IConfiguration configuration, ILogger<EmailService> logger)
        {
            _client = client;
            _fromAddress = new EmailAddress("noreply@interviewtime.io", "InterviewTime");
            _configuration = configuration;
            _logger = logger;
            _appHostUri = _configuration["AppHostUri"];
        }

        public async Task SendInterviewCancelledNotificationToInterviewer(InterviewCancelledToInterviewerModel model)
        {
            try
            {
                var to = new EmailAddress(model.InterviewerEmail);

                dynamic templateData = new
                {
                    candidateName = model.CandidateName,
                    interviwerName = model.InterviewerName,
                    interviewDate = model.InterviewStartTime.ToTimezoneTime(model.Timezone).ToString("dd MMM yyyy h:mm tt"),
                    interviewsUrl = $"{_appHostUri}/interviews"
                };

                var templateId = _configuration["EmailTemplates:InterviewCancelledToInterviewer"];
                SendGridMessage message = MailHelper.CreateSingleTemplateEmail(_fromAddress, to, templateId, templateData);

                var response = await _client.SendEmailAsync(message).ConfigureAwait(false);
                if (!response.IsSuccessStatusCode)
                {
                    var errorReason = await response.Body.ReadAsStringAsync();
                    _logger.LogError($"Error sending email SendInterviewCancelledNotificationToInterviewer: {errorReason}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("Error sending email SendInterviewCancelledNotificationToInterviewer", ex);
            }
        }

        public async Task SendChallengeCompletedNotification(string interviewerEmail, string interviewerName, string interviewUrl)
        {
            try
            {
                var to = new EmailAddress(interviewerEmail);

                dynamic templateData = new
                {
                    interviewerName = interviewerName,
                    interviewUrl = interviewUrl
                };

                var templateId = _configuration["EmailTemplates:ChallengeCompletedNotification"];
                SendGridMessage message = MailHelper.CreateSingleTemplateEmail(_fromAddress, to, templateId, templateData);


                var response = await _client.SendEmailAsync(message).ConfigureAwait(false);
                if (!response.IsSuccessStatusCode)
                {
                    var errorReason = await response.Body.ReadAsStringAsync();
                    _logger.LogError($"Error sending email ChallengeCompletedNotification: {errorReason}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("Error sending email ChallengeCompletedNotification", ex);
            }
        }

        public async Task<bool> SendTakeHomeChallenge(string candidateEmail, string candidateName, string challengePageUrl)
        {
            var isSent = true;

            try
            {
                var to = new EmailAddress(candidateEmail);

                dynamic templateData = new
                {
                    candidateName = candidateName,
                    challengeUrl = challengePageUrl
                };

                var templateId = _configuration["EmailTemplates:TakeHomeChallenge"];
                SendGridMessage message = MailHelper.CreateSingleTemplateEmail(_fromAddress, to, templateId, templateData);


                var response = await _client.SendEmailAsync(message).ConfigureAwait(false);
                if (!response.IsSuccessStatusCode)
                {
                    var errorReason = await response.Body.ReadAsStringAsync();
                    _logger.LogError($"Error sending email SendTakeHomeChallenge: {errorReason}");
                    isSent = false;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("Error sending email SendTakeHomeChallenge", ex);
                isSent = false;
            }

            return isSent;
        }

        public async Task SendInviteEmail(string inviteeEmail, string inviterName, string teamName, string token)
        {
            try
            {
                var to = new EmailAddress(inviteeEmail);

                dynamic templateData = new
                {
                    inviterName = inviterName,
                    teamName = teamName,
                    inviteLink = $"{_appHostUri}?inviteToken={token}"
                };

                var templateId = _configuration["EmailTemplates:InviteTeamMember"];
                SendGridMessage message = MailHelper.CreateSingleTemplateEmail(_fromAddress, to, templateId, templateData);


                var response = await _client.SendEmailAsync(message).ConfigureAwait(false);
                if (!response.IsSuccessStatusCode)
                {
                    var errorReason = await response.Body.ReadAsStringAsync();
                    _logger.LogError($"Error sending email SendInviteEmail: {errorReason}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("Error sending email SendInviteEmail", ex);
            }
        }

        public async Task SendNewInterviewInvitation(string toEmail, string interviewerName, string candidateName, DateTime interviewStartDateTime, DateTime interviewEndDateTime, string interviewId, string timezone, string teamId)
        {
            try
            {
                var to = new EmailAddress(toEmail);

                if (!string.IsNullOrWhiteSpace(timezone))
                {
                    TimeZoneInfo tzi = TimeZoneInfo.FindSystemTimeZoneById(timezone);

                    if (interviewStartDateTime.Kind != DateTimeKind.Utc)
                    {
                        interviewStartDateTime = interviewStartDateTime.ToUniversalTime();
                    }
                    interviewStartDateTime = TimeZoneInfo.ConvertTimeFromUtc(interviewStartDateTime, tzi);

                    if (interviewEndDateTime.Kind != DateTimeKind.Utc)
                    {
                        interviewEndDateTime = interviewEndDateTime.ToUniversalTime();
                    }
                    interviewEndDateTime = TimeZoneInfo.ConvertTimeFromUtc(interviewEndDateTime, tzi);
                }

                dynamic templateData = new
                {
                    candidateName = candidateName,
                    interviewerName = !interviewerName.Equals(toEmail) ? interviewerName : "there",
                    interviewDate = interviewStartDateTime.ToString("dd MMM yyyy h:mm tt"),
                    interviewTime = $"({timezone ?? "UTC"})",
                    interviewScorecard = $"{_appHostUri}/interviews/scorecard/{interviewId}?teamId={teamId}"
                };

                var description = $"You have a new interview scheduled for {templateData.interviewDate} {templateData.interviewTime} with {candidateName}.\\n\\nHere is the link to the interview scorecard: {templateData.interviewScorecard}";

                if (interviewEndDateTime < interviewStartDateTime)
                {
                    interviewEndDateTime = interviewEndDateTime.AddHours(1);
                }

                var invite = CreateInvite(interviewStartDateTime, interviewEndDateTime, timezone, $"Interview with {candidateName}", description);
                var attachment = new Attachment
                {
                    Filename = "invite.ics",
                    Content = StringHelper.Base64Encode(invite),
                    ContentId = Guid.NewGuid().ToString(),
                    Disposition = "attachment",
                    Type = "text/calendar; method=REQUEST"
                };

                var templateId = _configuration["EmailTemplates:ScheduleInterview"];
                SendGridMessage message = MailHelper.CreateSingleTemplateEmail(_fromAddress, to, templateId, templateData);
                message.AddAttachment(attachment);

                var response = await _client.SendEmailAsync(message).ConfigureAwait(false);
                if (!response.IsSuccessStatusCode)
                {
                    var errorReason = await response.Body.ReadAsStringAsync();
                    _logger.LogError($"Error sending email SendNewInterviewInvitation: {errorReason}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("Error sending email SendNewInterviewInvitation", ex);
            }
        }

        private string CreateInvite(DateTime startDate, DateTime endDate, string timezone, string summary, string description)
        {
            var sb = new StringBuilder();

            sb.AppendLine("BEGIN:VCALENDAR");

            sb.AppendLine("VERSION:2.0");
            sb.AppendLine("PRODID:stackoverflow.com");
            sb.AppendLine("CALSCALE:GREGORIAN");
            sb.AppendLine("METHOD:PUBLISH");

            sb.AppendLine("BEGIN:VTIMEZONE");
            sb.AppendLine($"TZID:{timezone}");
            sb.AppendLine("BEGIN:STANDARD");
            sb.AppendLine("END:STANDARD");
            sb.AppendLine("END:VTIMEZONE");

            sb.AppendLine("BEGIN:VEVENT");
            sb.AppendLine($"ORGANIZER;CN=InterviewTime;EMAIL={_fromAddress.Email}:mailto:{_fromAddress.Email}");
            sb.AppendLine($"DTSTART;TZID={timezone}:" + startDate.ToString("yyyyMMddTHHmm00"));
            sb.AppendLine($"DTEND;TZID={timezone}:" + endDate.ToString("yyyyMMddTHHmm00"));
            sb.AppendLine($"SUMMARY:{summary}");
            sb.AppendLine($"LOCATION:");
            sb.AppendLine($"DESCRIPTION:{description}");
            sb.AppendLine("PRIORITY:3");
            sb.AppendLine("END:VEVENT");

            sb.AppendLine("END:VCALENDAR");

            return sb.ToString();
        }
    }
}