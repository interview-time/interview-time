using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using CafApi.Command;
using CafApi.Models;
using CafApi.Repository;
using CafApi.Services;
using CafApi.Services.User;
using CafApi.ViewModel;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace CafApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("user")]
    public class UserController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IPermissionsService _permissionsService;                 
        private readonly IUserRepository _userRepository;
        private readonly ITeamService _teamService;
        private readonly ILogger<UserController> _logger;

        private string UserId
        {
            get
            {
                return User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            }
        }

        public UserController(
            IMediator mediator,
            IPermissionsService permissionsService,
            ILogger<UserController> logger,                   
            IUserRepository userRepository,
            ITeamService teamService,
            IConfiguration configuration)
        {
            _mediator = mediator;
            _permissionsService = permissionsService;
            _logger = logger;                     
            _userRepository = userRepository;
            _teamService = teamService;                        
        }

        [HttpGet]
        public async Task<ProfileResponse> GetUserProfile()
        {
            var profile = await _userRepository.GetProfile(UserId);
            if (profile == null)
            {
                return null;
            }

            List<(Team Team, TeamMember TeamMember)> teams = await _teamService.GetUserTeams(UserId);

            return new ProfileResponse
            {
                UserId = profile.UserId,
                Name = profile.Name,
                Email = profile.Email,
                Position = profile.Position,
                TimezoneOffset = profile.TimezoneOffset,
                Timezone = profile.Timezone,
                CurrentTeamId = profile.CurrentTeamId,
                Teams = teams.Select(t => new TeamItemResponse
                {
                    TeamId = t.Team.TeamId,
                    TeamName = t.Team.Name,
                    Roles = t.TeamMember.Roles
                }).ToList()
            };
        }

        [HttpPost]
        public async Task<SignUpUserCommandResult> SetupUser(SignUpUserCommand command)
        {
            command.UserId = UserId;

            return await _mediator.Send(command);
        }

        [HttpPut]
        public async Task UpdateUser(UpdateUserRequest request)
        {
            await _userRepository.UpdateProfile(UserId, request.Name, request.Position, request.TimezoneOffset, request.Timezone);
        }

        [HttpPut("current-team")]
        public async Task<ActionResult> UpdateCurrentTeam(UpdateCurrentTeamRequest request)
        {
            if (!await _permissionsService.IsBelongInTeam(UserId, request.CurrentTeamId))
            {
                return Unauthorized();
            }

            await _userRepository.UpdateCurrentTeam(UserId, request.CurrentTeamId);

            return Ok();
        }
    }
}
