using System;
using System.Threading;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using CafApi.Common;
using CafApi.Models;
using CafApi.Repository;
using CafApi.Services.Integration;
using CafApi.Services.User;
using MediatR;

namespace CafApi.Command
{
    public class SwapPublicTokenCommand : IRequest
    {
        public string UserId { get; set; }

        public string TeamId { get; set; }

        public string PublicToken { get; set; }
    }

    public class SwapPublicTokenCommandHandler : IRequestHandler<SwapPublicTokenCommand>
    {
        private readonly IMergeHttpClient _mergeHttpClient;
        private readonly IPermissionsService _permissionsService;
        private readonly ITeamRepository _teamRepository;
        private readonly DynamoDBContext _context;


        public SwapPublicTokenCommandHandler(
            IMergeHttpClient mergeHttpClient,
            IPermissionsService permissionsService,
            ITeamRepository teamRepository,
            IAmazonDynamoDB dynamoDbClient)
        {
            _mergeHttpClient = mergeHttpClient;
            _permissionsService = permissionsService;
            _teamRepository = teamRepository;
            _context = new DynamoDBContext(dynamoDbClient);
        }

        public async Task<Unit> Handle(SwapPublicTokenCommand command, CancellationToken cancellationToken)
        {
            if (!await _permissionsService.CanIntegrateWithATS(command.UserId, command.TeamId))
            {
                throw new AuthorizationException($"User ({command.UserId}) doesn't have permission to intergrate with ATS");
            }

            var response = await _mergeHttpClient.RetrieveAccountToken(command.PublicToken);
            if (response == null)
            {
                throw new MergeException("Error swaping public token for account token");
            }

            var team = await _teamRepository.GetTeam(command.TeamId);

            if (team.Integration == null)
            {
                team.Integration = new AtsIntegration();
            }

            team.Integration.MergeAccessToken = response.AccountToken;
            team.Integration.Status = IntegrationStatus.Completed.ToString();
            team.ModifiedDate = DateTime.UtcNow;

            await _context.SaveAsync(team);

            return Unit.Value;
        }
    }
}
