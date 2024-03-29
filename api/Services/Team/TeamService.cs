using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.DocumentModel;
using CafApi.Common;
using CafApi.Models;
using CafApi.Repository;
using CafApi.Services.User;

namespace CafApi.Services
{
    public class TeamService : ITeamService
    {
        private readonly IUserRepository _userRepository;
        private readonly ITeamRepository _teamRepository;
        private readonly IEmailService _emailService;
        private readonly IPermissionsService _permissionsService;
        private readonly DynamoDBContext _context;

        public TeamService(IAmazonDynamoDB dynamoDbClient,
            IUserRepository userRepository,
            ITeamRepository teamRepository,
            IEmailService emailService,
            IPermissionsService permissionsService)
        {
            _context = new DynamoDBContext(dynamoDbClient);
            _userRepository = userRepository;
            _teamRepository = teamRepository;
            _emailService = emailService;
            _permissionsService = permissionsService;
        }

        public async Task<TeamMember> GetTeamMember(string userId, string teamId)
        {
            return await _context.LoadAsync<TeamMember>(teamId, userId);
        }

        public async Task Update(string userId, string teamId, string name)
        {
            var team = await _teamRepository.GetTeam(teamId);
            if (team != null && team.OwnerId == userId)
            {
                team.Name = name;
                team.ModifiedDate = DateTime.UtcNow;

                await _context.SaveAsync(team);
            }
        }

        public async Task Delete(string userId, string teamId)
        {
            var team = await _teamRepository.GetTeam(teamId);
            if (team != null && team.OwnerId == userId)
            {
                // get team interviews
                var interviews = await _context.QueryAsync<Interview>(teamId, new DynamoDBOperationConfig()).GetRemainingAsync();

                // Delete team interviews
                if (interviews != null && interviews.Any())
                {
                    var interviewBatch = _context.CreateBatchWrite<Interview>();
                    interviewBatch.AddDeleteItems(interviews);
                    await interviewBatch.ExecuteAsync();
                }

                // get team templates
                var templates = await _context.QueryAsync<Template>(teamId, new DynamoDBOperationConfig()).GetRemainingAsync();

                // Delete team templates
                if (templates != null && templates.Any())
                {
                    var templateBatch = _context.CreateBatchWrite<Template>();
                    templateBatch.AddDeleteItems(templates);
                    await templateBatch.ExecuteAsync();
                }

                // Remove members from the team
                List<(Profile Profile, TeamMember TeamMember)> members = await GetTeamMembers(userId, teamId);
                foreach (var member in members)
                {
                    await LeaveTeam(member.Profile.UserId, teamId);
                }

                // Delete team
                await _context.DeleteAsync(team);
            }
        }

        public async Task<List<(Team, TeamMember)>> GetUserTeams(string userId)
        {
            var result = new List<(Team, TeamMember)>();

            // Get all team this user is a member of
            var search = _context.FromQueryAsync<TeamMember>(new QueryOperationConfig()
            {
                IndexName = "UserId-index",
                Filter = new QueryFilter(nameof(TeamMember.UserId), QueryOperator.Equal, userId)
            });
            var memberOfTeams = await search.GetRemainingAsync();

            if (memberOfTeams != null && memberOfTeams.Any())
            {
                var teamBatch = _context.CreateBatchGet<Team>();
                foreach (var memberOfTeam in memberOfTeams)
                {
                    teamBatch.AddKey(memberOfTeam.TeamId);
                }
                await teamBatch.ExecuteAsync();

                // prep result
                foreach (var memberOfTeam in memberOfTeams)
                {
                    var team = teamBatch.Results.FirstOrDefault(t => t.TeamId == memberOfTeam.TeamId);
                    result.Add((team, memberOfTeam));
                }
            }

            return result;
        }

        public async Task<List<(Profile, TeamMember)>> GetTeamMembers(string userId, string teamId)
        {
            var result = new List<(Profile, TeamMember)>();
            // check if user belongs to the team
            var belongsToTeam = await _permissionsService.IsBelongInTeam(userId, teamId);
            if (belongsToTeam)
            {
                var teamMembers = await _context.QueryAsync<TeamMember>(teamId, new DynamoDBOperationConfig()).GetRemainingAsync();

                // Get profile for every team member
                var profileBatch = _context.CreateBatchGet<Profile>();
                foreach (var teamMember in teamMembers)
                {
                    profileBatch.AddKey(teamMember.UserId);
                }
                await profileBatch.ExecuteAsync();

                // prep result
                foreach (var teamMember in teamMembers)
                {
                    var profile = profileBatch.Results.FirstOrDefault(p => p.UserId == teamMember.UserId);
                    result.Add((profile, teamMember));
                }
            }

            return result;
        }

        public async Task<List<Invite>> GetPendingInvites(string userId, string teamId)
        {
            var teamInvites = new List<Invite>();

            var belongsToTeam = await _permissionsService.IsBelongInTeam(userId, teamId);
            if (belongsToTeam)
            {
                var search = _context.FromQueryAsync<Invite>(new QueryOperationConfig()
                {
                    IndexName = "TeamId-index",
                    Filter = new QueryFilter(nameof(CafApi.Models.Invite.TeamId), QueryOperator.Equal, teamId)
                });

                teamInvites = await search.GetRemainingAsync();
                teamInvites = teamInvites.Where(i => !i.IsAccepted).ToList();
            }

            return teamInvites;
        }

        public async Task Invite(string userId, string inviteeEmail, string teamId, string role)
        {
            var belongsToTeam = await _permissionsService.IsBelongInTeam(userId, teamId);
            if (belongsToTeam)
            {
                var invites = await GetPendingInvites(userId, teamId);
                var invite = invites.FirstOrDefault(i => i.InviteeEmail == inviteeEmail);

                if (invite == null)
                {
                    invite = new Invite
                    {
                        Token = StringHelper.GenerateToken(),
                        InviteId = Guid.NewGuid().ToString(),
                        InviteeEmail = inviteeEmail,
                        TeamId = teamId,
                        Role = role,
                        InvitedBy = userId,
                        CreatedDate = DateTime.UtcNow,
                        ModifiedDate = DateTime.UtcNow,
                    };

                    await _context.SaveAsync(invite);
                }

                var inviter = await _userRepository.GetProfile(userId);
                var team = await _teamRepository.GetTeam(teamId);

                await _emailService.SendInviteEmail(inviteeEmail, inviter.Name, team.Name, invite.Token);
            }
        }

        public async Task CancelInvite(string userId, string teamId, string inviteId)
        {
            var pendingInvites = await GetPendingInvites(teamId);
            var invite = pendingInvites.FirstOrDefault(i => i.InviteId == inviteId);
            if (invite != null)
            {
                if (await _permissionsService.CanCancelInvite(userId, teamId, invite.InvitedBy == userId))
                {
                    await _context.DeleteAsync(invite);
                }
                else
                {
                    throw new AuthorizationException($"User {userId} cannot cancel invite {inviteId}");
                }
            }
        }

        public async Task<string> AcceptInvite(string userId, string inviteToken)
        {
            string teamId = null;

            var invite = await _context.LoadAsync<Invite>(inviteToken);
            if (invite != null && !invite.IsAccepted)
            {
                if (await _teamRepository.AddToTeam(userId, invite.TeamId, invite.Role))
                {
                    invite.AcceptedBy = userId;
                    invite.IsAccepted = true;
                    invite.ModifiedDate = DateTime.UtcNow;

                    await _context.SaveAsync(invite);

                    teamId = invite.TeamId;
                }
            }

            return teamId;
        }

        public async Task LeaveTeam(string userId, string teamId)
        {
            var teamMember = await _context.LoadAsync<TeamMember>(teamId, userId);
            if (teamMember != null)
            {
                await _context.DeleteAsync(teamMember);
            }
        }

        public async Task RemoveTeamMember(string adminId, string memberId, string teamId)
        {
            var admin = await _context.LoadAsync<TeamMember>(teamId, adminId);
            if (admin != null && admin.Roles.Contains(TeamRole.ADMIN.ToString()))
            {
                await LeaveTeam(memberId, teamId);
            }
        }

        public async Task UpdateMemberRole(string adminId, string memberId, string teamId, string newRole)
        {
            var admin = await _context.LoadAsync<TeamMember>(teamId, adminId);
            if (admin != null && admin.Roles.Contains(TeamRole.ADMIN.ToString()))
            {
                var member = await _context.LoadAsync<TeamMember>(teamId, memberId);
                if (member != null)
                {
                    member.Roles = new List<string> { newRole };
                    await _context.SaveAsync(member);
                }
            }
        }

        private async Task<List<Invite>> GetPendingInvites(string teamId)
        {
            var teamInvites = new List<Invite>();

            var search = _context.FromQueryAsync<Invite>(new QueryOperationConfig()
            {
                IndexName = "TeamId-index",
                Filter = new QueryFilter(nameof(CafApi.Models.Invite.TeamId), QueryOperator.Equal, teamId)
            });

            teamInvites = await search.GetRemainingAsync();
            teamInvites = teamInvites.Where(i => !i.IsAccepted).ToList();

            return teamInvites;
        }

        private async Task<List<TeamMember>> GetTeamMembers(string teamId)
        {
            return await _context.QueryAsync<TeamMember>(teamId, new DynamoDBOperationConfig()).GetRemainingAsync();
        }
    }
}
