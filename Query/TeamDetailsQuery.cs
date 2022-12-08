using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CafApi.Common;
using CafApi.Models;
using CafApi.Repository;
using CafApi.Services;
using CafApi.Services.User;
using CafApi.ViewModel;
using MediatR;

namespace CafApi.Query
{
    public class TeamDetailsQuery : IRequest<TeamDetailsQueryResult>
    {
        public string UserId { get; set; }

        public string TeamId { get; set; }
    }

    public class TeamDetailsQueryResult
    {
        public string TeamId { get; set; }

        public string TeamName { get; set; }

        public List<TeamMembersResponse> TeamMembers { get; set; }

        public List<PendingInviteResponse> PendingInvites { get; set; }

        public string Token { get; set; }

        public List<string> Roles { get; set; }

        public int Seats { get; set; }

        public string Plan { get; set; }

        public int AvailableSeats { get; set; }

        public Integration Integration { get; set; }
    }

    public class Integration
    {
        public string Status { get; set; }

        public string ATS { get; set; }

        public DateTime? LastSync { get; set; }
    }

    public class TeamDetailsQueryHandler : IRequestHandler<TeamDetailsQuery, TeamDetailsQueryResult>
    {
        private readonly IPermissionsService _permissionsService;
        private readonly ITeamService _teamService;
        private readonly ITeamRepository _teamRepository;
        private readonly IUserRepository _userRepository;

        public TeamDetailsQueryHandler(
            IPermissionsService permissionsService,
            ITeamService teamService,
            ITeamRepository teamRepository,
            IUserRepository userRepository)
        {
            _permissionsService = permissionsService;
            _teamService = teamService;
            _teamRepository = teamRepository;
            _userRepository = userRepository;
        }

        public async Task<TeamDetailsQueryResult> Handle(TeamDetailsQuery query, CancellationToken cancellationToken)
        {
            var teamMember = await _permissionsService.IsTeamMember(query.UserId, query.TeamId);
            if (!teamMember.IsTeamMember)
            {
                throw new AuthorizationException($"User ({query.UserId}) doesn't have access to the details of team ({query.TeamId})");
            }

            var team = await _teamRepository.GetTeam(query.TeamId);
            if (team == null)
            {
                throw new ItemNotFoundException($"Team ({query.TeamId}) not found");
            }

            List<(Profile Profile, TeamMember TeamMember)> members = await _teamService.GetTeamMembers(query.UserId, query.TeamId);
            var invites = await _teamService.GetPendingInvites(query.UserId, query.TeamId);
            var invitedByList = await _userRepository.GetUserProfiles(invites.Select(i => i.InvitedBy).Distinct().ToList());
            var availableSeats = await _teamService.GetAvailableSeats(query.TeamId);

            return new TeamDetailsQueryResult
            {
                TeamId = team.TeamId,
                TeamName = team.Name,
                TeamMembers = members.Select(m => new TeamMembersResponse
                {
                    UserId = m.Profile.UserId,
                    Name = m.Profile.Name,
                    Email = m.Profile.Email,
                    IsAdmin = m.Profile.UserId == team.OwnerId,
                    Roles = m.TeamMember.Roles
                }).ToList(),
                PendingInvites = invites.Select(i => new PendingInviteResponse
                {
                    InviteId = i.InviteId,
                    InviteeEmail = i.InviteeEmail,
                    Role = i.Role,
                    InvitedBy = invitedByList.FirstOrDefault(invitedBy => invitedBy.UserId == i.InvitedBy)?.Name,
                    InvitedDate = i.CreatedDate
                }).ToList(),
                Token = team.Token,
                Roles = members.FirstOrDefault(m => m.TeamMember.UserId == query.UserId).TeamMember?.Roles,
                Seats = team.Seats == 0 ? 2 : team.Seats,
                Plan = team.Plan ?? SubscriptionPlan.STARTER.ToString(),
                AvailableSeats = availableSeats,
                Integration = new Integration
                {
                    Status = team.Integration?.Status ?? IntegrationStatus.None.ToString(),
                    LastSync = team.Integration?.LastSync,
                    ATS = team.Integration?.ATS
                }
            };
        }
    }
}
