using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using CafApi.Common;
using CafApi.Models;
using CafApi.Query;
using CafApi.Repository;
using CafApi.Services;
using CafApi.Services.User;
using CafApi.ViewModel;
using MediatR;
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
        private readonly IMediator _mediator;
        private readonly ITeamService _teamService;
        private readonly ITeamRepository _teamRepository;
        private readonly IUserRepository _userRepository;        
        private readonly IPermissionsService _permissionsService;
        private readonly ILogger<UserController> _logger;

        private string UserId
        {
            get
            {
                return User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            }
        }

        public TeamController(
            IMediator mediator,
            ILogger<UserController> logger,
            ITeamService teamService,
            ITeamRepository teamRepository,
            IPermissionsService permissionsService,
            IUserRepository userRepository)
        {
            _mediator = mediator;
            _logger = logger;
            _teamService = teamService;
            _teamRepository = teamRepository;
            _permissionsService = permissionsService;
            _userRepository = userRepository;
        }

        [HttpGet("{teamId}")]
        public async Task<ActionResult<TeamDetailsQueryResult>> GetTeam(string teamId)
        {
            try
            {
                var query = new TeamDetailsQuery
                {
                    UserId = UserId,
                    TeamId = teamId
                };

                var teamDetails = await _mediator.Send(query);

                return Ok(teamDetails);
            }
            catch (AuthorizationException ex)
            {
                _logger.LogError(ex, ex.Message);

                return Unauthorized(ex.Message);
            }
            catch (ItemNotFoundException ex)
            {
                _logger.LogError(ex, ex.Message);

                return NotFound(ex.Message);
            }
        }

        [HttpPost()]
        public async Task<Team> CreateTeam(CreateTeamRequest request)
        {
            var team = await _teamRepository.CreateTeam(UserId, request.TeamName);

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
            var team = await _teamRepository.GetTeam(teamId);
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

        [HttpPut("invite")]
        public async Task Invite(InviteRequest request)
        {
            await _teamService.Invite(UserId, request.Email, request.TeamId, request.Role);
        }

        [HttpDelete("{teamId}/invite/{inviteId}")]
        public async Task<ActionResult> Invite(string teamId, string inviteId)
        {
            try
            {
                await _teamService.CancelInvite(UserId, teamId, inviteId);
            }
            catch (AuthorizationException ex)
            {
                _logger.LogWarning(ex, ex.Message);

                return Unauthorized();
            }

            return Ok();
        }

        [HttpPut("accept-invite")]
        public async Task<ActionResult> AcceptInvite(AcceptInviteRequest request)
        {
            var teamId = await _teamService.AcceptInvite(UserId, request.InviteToken);

            if (teamId == null)
            {
                return NotFound();
            }

            if (!await _permissionsService.IsBelongInTeam(UserId, teamId))
            {
                return Unauthorized();
            }

            await _userRepository.UpdateCurrentTeam(UserId, teamId);

            return Ok();
        }

        [HttpGet("{teamId}/invites/pending")]
        public async Task<List<PendingInviteResponse>> GetPendingInvites(string teamId)
        {
            var invites = await _teamService.GetPendingInvites(UserId, teamId);
            var invitedByList = await _userRepository.GetUserProfiles(invites.Select(i => i.InvitedBy).Distinct().ToList());

            return invites.Select(i => new PendingInviteResponse
            {
                InviteId = i.InviteId,
                InviteeEmail = i.InviteeEmail,
                Role = i.Role,
                InvitedBy = invitedByList.FirstOrDefault(invitedBy => invitedBy.UserId == i.InvitedBy)?.Name,
                InvitedDate = i.CreatedDate
            }).ToList();
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