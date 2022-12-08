using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using CafApi.Common;
using CafApi.Repository;
using CafApi.Services.Integration;
using CafApi.Services.User;
using MediatR;

namespace CafApi.Query
{
    public class LinkTokenQuery : IRequest<LinkTokenQueryResult>
    {
        public string UserId { get; set; }

        public string TeamId { get; set; }
    }

    public class LinkTokenQueryResult
    {
        public string LinkToken { get; set; }
    }

    public class LinkTokenQueryHandler : IRequestHandler<LinkTokenQuery, LinkTokenQueryResult>
    {
        private readonly IMergeHttpClient _mergeHttpClient;
        private readonly ITeamRepository _teamRepository;
        private readonly IPermissionsService _permissionsService;
        private readonly IUserRepository _userRepository;

        public LinkTokenQueryHandler(
            IMergeHttpClient mergeHttpClient,
            ITeamRepository teamRepository,
            IPermissionsService permissionsService,
            IUserRepository userRepository)
        {
            _mergeHttpClient = mergeHttpClient;
            _teamRepository = teamRepository;
            _permissionsService = permissionsService;
            _userRepository = userRepository;
        }

        public async Task<LinkTokenQueryResult> Handle(LinkTokenQuery query, CancellationToken cancellationToken)
        {
            if (!await _permissionsService.CanIntegrateWithATS(query.UserId, query.TeamId))
            {
                throw new AuthorizationException($"User ({query.UserId}) doesn't have permission to intergrate with ATS");
            }

            var team = await _teamRepository.GetTeam(query.TeamId);
            var user = await _userRepository.GetProfile(query.UserId);

            var request = new CreateLinkTokenRequest
            {
                EndUserOriginId = team.TeamId,
                EndUserOrganizationName = team.Name,
                EndUserEmailAddress = user.Email,
                Categories = new List<string> { "ats" }
            };

            var response = await _mergeHttpClient.CreateLinkToken(request);
            if (response == null)
            {
                throw new MergeException("Error getting link token");
            }

            return new LinkTokenQueryResult
            {
                LinkToken = response.LinkToken
            };
        }
    }
}
