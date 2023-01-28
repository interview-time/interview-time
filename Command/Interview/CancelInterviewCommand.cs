using System;
using System.Threading;
using System.Threading.Tasks;
using CafApi.Common;
using CafApi.Models;
using CafApi.Repository;
using CafApi.Services;
using CafApi.Services.Email;
using CafApi.Services.User;
using MediatR;

namespace CafApi.Command
{
    public class CancelInterviewCommand : IRequest<Interview>
    {
        public string TeamId { get; set; }

        public string UserId { get; set; }

        public string InterviewId { get; set; }
    }

    public class CancelInterviewCommandHandler : IRequestHandler<CancelInterviewCommand, Interview>
    {
        private readonly ICandidateRepository _candidateRepository;
        private readonly IUserRepository _userRepository;
        private readonly IPermissionsService _permissionsService;
        private readonly IInterviewRepository _interviewRepository;
        private readonly IEmailService _emailService;

        public CancelInterviewCommandHandler(
            ICandidateRepository candidateRepository,
            IUserRepository userRepository,
            IPermissionsService permissionsService,
            IInterviewRepository interviewRepository,
            IEmailService emailService)
        {
            _candidateRepository = candidateRepository;
            _userRepository = userRepository;
            _permissionsService = permissionsService;
            _interviewRepository = interviewRepository;
            _emailService = emailService;
        }

        public async Task<Interview> Handle(CancelInterviewCommand command, CancellationToken cancellationToken)
        {
            if (!await _permissionsService.CanManageInterviews(command.UserId, command.TeamId))
            {
                throw new AuthorizationException($"User {command.UserId} doesn't have permissions to cancel interview {command.InterviewId}");
            }

            var interview = await _interviewRepository.GetInterview(command.InterviewId);
            if (interview == null)
            {
                throw new ItemNotFoundException($"Interview {command.InterviewId} not found");
            }

            interview.Status = InterviewStatus.CANCELLED.ToString();
            interview.ModifiedDate = DateTime.UtcNow;

            await _interviewRepository.SaveInterview(interview);

            var interviewerProfile = await _userRepository.GetProfile(interview.UserId);
            var candidate = await _candidateRepository.GetCandidate(command.TeamId, interview.CandidateId);

            var model = new InterviewCancelledToInterviewerModel
            {
                InterviewerEmail = interviewerProfile.Email,
                InterviewerName = interviewerProfile.Name,
                CandidateName = candidate.CandidateName,
                InterviewStartTime = interview.InterviewDateTime,
                Timezone = interviewerProfile.Timezone
            };

            await _emailService.SendInterviewCancelledNotificationToInterviewer(model);

            return interview;
        }
    }
}
