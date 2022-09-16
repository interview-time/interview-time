using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using CafApi.Models;
using CafApi.Services;
using CafApi.Services.User;
using CafApi.Common;
using CafApi.ViewModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using CafApi.Repository;

namespace CafApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("interview")]
    public class InterviewController : ControllerBase
    {
        private readonly IInterviewService _interviewService;
        private readonly IUserRepository _userRepository;
        private readonly IPermissionsService _permissionsService;
        private readonly ILogger<InterviewController> _logger;
        private readonly IEmailService _emailService;
        private readonly string _demoUserId;

        private string UserId
        {
            get
            {
                return User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            }
        }

        public InterviewController(ILogger<InterviewController> logger,
            IInterviewService interviewService,
            IUserRepository userRepository,
            IConfiguration configuration,
            IEmailService emailService,
            IPermissionsService permissionsService)
        {
            _logger = logger;
            _interviewService = interviewService;
            _userRepository = userRepository;
            _emailService = emailService;
            _permissionsService = permissionsService;

            _demoUserId = configuration["DemoUserId"];
        }

        [HttpGet("{teamId?}")]
        public async Task<List<Interview>> Get(string teamId = null)
        {
            var interviews = await _interviewService.GetInterviews(UserId, teamId);

            return interviews;
        }

        [HttpPost()]
        public async Task<Interview> ScheduleInterview([FromBody] Interview interview)
        {
            if (interview.Interviewers != null && interview.Interviewers.Any() && !string.IsNullOrWhiteSpace(interview.TeamId))
            {
                Interview mainInterview = null;
                var interviews = new Dictionary<string, Interview>();
                string linkId = interview.Interviewers.Count > 1 ? Guid.NewGuid().ToString() : null;

                List<string> challengeIds = null;
                if (interview.Challenges != null && interview.Challenges.Any())
                {
                    challengeIds = interview.Challenges.Select(c => c.ChallengeId).ToList();
                }

                foreach (var interviewerId in interview.Interviewers)
                {
                    var isBelongInTeam = await _permissionsService.IsBelongInTeam(interviewerId, interview.TeamId);
                    if (isBelongInTeam)
                    {
                        var newInterview = interview.Clone();
                        newInterview.UserId = interviewerId;
                        newInterview.LinkId = linkId;
                        newInterview.ChallengeIds = challengeIds;

                        // Demo account
                        if (UserId == _demoUserId)
                        {
                            interview.IsDemo = true;
                        }

                        newInterview = await _interviewService.AddInterview(newInterview);
                        interviews.Add(interviewerId, newInterview);

                        if (newInterview.UserId == UserId)
                        {
                            mainInterview = newInterview;
                        }
                    }
                }

                // Send email notification
                var profiles = await _userRepository.GetUserProfiles(interview.Interviewers);
                foreach (var profile in profiles)
                {
                    var interviewId = interviews.GetValueOrDefault(profile.UserId)?.InterviewId;
                    await _emailService.SendNewInterviewInvitation(profile.Email, profile.Name, interview.Candidate, interview.InterviewDateTime, interview.InterviewEndDateTime, interviewId, profile.Timezone, interview.TeamId);
                }

                return mainInterview;
            }

            return null;
        }

        [HttpPut()]
        public async Task UpdateInterview([FromBody] Interview interview)
        {
            interview.UserId = UserId;
            if (UserId == _demoUserId)
            {
                interview.IsDemo = true;
            }

            await _interviewService.UpdateInterview(interview);
        }

        [HttpDelete("{interviewId}")]
        public async Task DeleteInterview(string interviewId)
        {
            await _interviewService.DeleteInterview(UserId, interviewId);
        }

        [Obsolete]
        [HttpPatch("scorecard")]
        public async Task SubmitScoreCard([FromBody] ScoreCardRequest scoreCard)
        {
            await _interviewService.SubmitScorecard(UserId, scoreCard);
        }
    }
}