using System;
using System.Threading.Tasks;

namespace CafApi.Services
{
    public interface IEmailService
    {
        Task SendInviteEmail(string inviteeEmail, string inviterName, string teamName, string token);
        
        Task SendNewInterviewInvitation(string toEmail, string interviewerName, string candidateName, DateTime interviewStartDateTime, DateTime interviewEndDateTime, string interviewId, string timezone, string teamId);

        Task<bool> SendTakeHomeChallenge(string candidateEmail, string candidateName, string challengePageUrl);

        Task SendChallengeCompletedNotification(string interviewerEmail, string interviewerName, string interviewUrl);
    }
}