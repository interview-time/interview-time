using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using CafApi.Models;
using CafApi.Services;
using CafApi.ViewModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace CafApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("team")]
    public class TeamController : ControllerBase
    {
        private readonly ITeamService _teamService;
        private readonly ILogger<UserController> _logger;

        private string UserId
        {
            get
            {
                return User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            }
        }

        public TeamController(ILogger<UserController> logger, ITeamService teamService)
        {
            _logger = logger;
            _teamService = teamService;
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

        [HttpGet("members/{teamId}")]
        public async Task<ActionResult<List<TeamMembersResponse>>> GetTeamMembers(string teamId)
        {
            var team = await _teamService.GetTeam(teamId);
            if (team == null)
            {
                return NotFound();
            }

            var members = await _teamService.GetTeamMembers(UserId, teamId);

            return members.Select(m => new TeamMembersResponse
            {
                UserId = m.UserId,
                Name = m.Name,
                Email = m.Email,
                IsAdmin = m.UserId == team.OwnerId
            }).ToList();
        }

        [HttpPut("join")]
        public async Task<Team> JoinTeam(JoinTeamRequest request)
        {
            var team = await _teamService.JoinTeam(UserId, request.Token);

            return team;
        }

        [HttpPut("leave")]
        public async Task LeaveTeam(LeaveTeamRequest request)
        {
            await _teamService.LeaveTeam(UserId, request.TeamId);
        }
    }
}