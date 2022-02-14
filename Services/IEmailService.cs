using System;
using System.Threading.Tasks;

namespace CafApi.Services
{
    public interface IEmailService
    {
        Task SendNewInterviewInvitation(string toEmail, string interviewerName, string candidateName, DateTime interviewDateTime, string interviewId, string timezone, string teamId);        
    }
}