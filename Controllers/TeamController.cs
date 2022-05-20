using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using CafApi.Models;
using CafApi.Services;
using CafApi.ViewModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace CafApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("team")]
    public class TeamController : ControllerBase
    {
        private readonly ITeamService _teamService;
        private readonly IUserService _userService;
        private readonly ILogger<UserController> _logger;

        private string UserId
        {
            get
            {
                return User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            }
        }

        public TeamController(ILogger<UserController> logger, ITeamService teamService, IUserService userService)
        {
            _logger = logger;
            _teamService = teamService;
            _userService = userService;
        }

        [HttpPost()]
        public async Task<Team> CreateTeam(CreateTeamRequest request)
        {
            var team = await _teamService.CreateTeam(UserId, request.TeamName);

            return team;
        }

        [HttpPut()]
        public async Task UpdateTeam(UpdateTeamRequest request)
        {
            await _teamService.Update(UserId, request.TeamId, request.TeamName);
        }

        [HttpDelete("{teamId}")]
        public async Task DeleteTeam(string teamId)
        {
            await _teamService.Delete(UserId, teamId);
        }

        [HttpGet("members/{teamId}")]
        public async Task<ActionResult<List<TeamMembersResponse>>> GetTeamMembers(string teamId)
        {
            var team = await _teamService.GetTeam(teamId);
            if (team == null)
            {
                return NotFound();
            }

            List<(Profile Profile, TeamMember TeamMember)> members = await _teamService.GetTeamMembers(UserId, teamId);

            return members.Select(m => new TeamMembersResponse
            {
                UserId = m.Profile.UserId,
                Name = m.Profile.Name,
                Email = m.Profile.Email,
                IsAdmin = m.Profile.UserId == team.OwnerId,
                Roles = m.TeamMember.Roles
            }).ToList();
        }

        [HttpPut("join")]
        public async Task<Team> JoinTeam(JoinTeamRequest request)
        {
            var team = await _teamService.JoinTeam(UserId, request.Token, request.Role);

            return team;
        }

        [HttpPut("invite")]
        public async Task Invite(InviteRequest request)
        {
            await _teamService.Invite(UserId, request.Email, request.TeamId, request.Role);
        }

        [HttpPut("accept-invite")]
        public async Task<ActionResult> AcceptInvite(AcceptInviteRequest request)
        {
            var teamId = await _teamService.AcceptInvite(UserId, request.InviteToken);

            if (teamId == null)
            {
                return NotFound();
            }

            await _userService.UpdateCurrentTeam(UserId, teamId);

            return Ok();
        }

        [HttpPut("leave")]
        public async Task LeaveTeam(LeaveTeamRequest request)
        {
            await _teamService.LeaveTeam(UserId, request.TeamId);
        }

        [HttpPut("member")]
        public async Task ChangeMemberRole(ChangeMemberRoleRequest request)
        {
            await _teamService.UpdateMemberRole(UserId, request.MemberId, request.TeamId, request.NewRole);
        }

        [HttpDelete("member/{memberId}/team/{teamId}")]
        public async Task RemoveTeamMember(string memberId, string teamId)
        {
            await _teamService.RemoveTeamMember(UserId, memberId, teamId);
        }
    }
}