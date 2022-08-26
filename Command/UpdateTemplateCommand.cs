using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using CafApi.Common;
using CafApi.Models;
using CafApi.Repository;
using CafApi.Services.User;
using MediatR;

namespace CafApi.Command
{
    public class UpdateTemplateCommand : IRequest
    {
        public string UserId { get; set; }

        public string TeamId { get; set; }

        public string TemplateId { get; set; }

        public string Title { get; set; }

        public string Type { get; set; }

        public string InterviewType { get; set; }

        public string Description { get; set; }

        public string Image { get; set; }

        public TemplateStructure Structure { get; set; }

        public List<Challenge> Challenges { get; set; }
    }

    public class UpdateTemplateCommandHandler : IRequestHandler<UpdateTemplateCommand>
    {
        private readonly IPermissionsService _permissionsService;
        private readonly ITemplateRepository _templateRepository;
        private readonly IChallengeRepository _challengeRepository;
        private readonly DynamoDBContext _context;

        public UpdateTemplateCommandHandler(IPermissionsService permissionsService,
            ITemplateRepository templateRepository,
            IChallengeRepository challengeRepository,
            IAmazonDynamoDB dynamoDbClient)
        {
            _permissionsService = permissionsService;
            _templateRepository = templateRepository;
            _challengeRepository = challengeRepository;
            _context = new DynamoDBContext(dynamoDbClient);
        }

        public async Task<Unit> Handle(UpdateTemplateCommand command, CancellationToken cancellationToken)
        {
            if (!await _permissionsService.IsBelongInTeam(command.UserId, command.TeamId))
            {
                throw new AuthorizationException($"User ({command.UserId}) doesn't belong to the team ({command.TeamId})");

            }
            var template = await _templateRepository.GetTemplate(command.TemplateId);

            template.Title = command.Title;
            template.Type = command.Type;
            template.Description = command.Description;
            template.Structure = command.Structure;
            template.ModifiedDate = DateTime.UtcNow;

            if (string.IsNullOrWhiteSpace(template.Token))
            {
                template.Token = StringHelper.GenerateToken();
            }

            // Update challenges
            if (command.Challenges != null && command.Challenges.Any())
            {
                var challengeIds = command.Challenges.Select(c => c.ChallengeId).ToList();
                template.ChallengeIds = challengeIds;

                var existingChallenges = await _challengeRepository.GetChallenges(command.TeamId, challengeIds);
                var newChallenges = new List<Challenge>();

                foreach (var challenge in command.Challenges)
                {
                    var existingChallenge = existingChallenges.FirstOrDefault(ec => ec.ChallengeId == challenge.ChallengeId);
                    if (existingChallenge != null)
                    {
                        existingChallenge.Name = challenge.Name;
                        existingChallenge.Description = challenge.Description;
                        existingChallenge.FileName = challenge.FileName;
                        existingChallenge.GitHubUrl = challenge.GitHubUrl;
                        existingChallenge.ModifiedBy = command.UserId;
                        existingChallenge.ModifiedDate = DateTime.UtcNow;

                        await _context.SaveAsync(existingChallenge);
                    }
                    else
                    {
                        challenge.TeamId = command.TeamId;
                        challenge.CreatedBy = command.UserId;
                        challenge.ModifiedBy = command.UserId;
                        challenge.CreatedDate = DateTime.UtcNow;
                        challenge.ModifiedDate = DateTime.UtcNow;

                        newChallenges.Add(challenge);
                    }
                }

                // Add any new challenges
                await _challengeRepository.BatchAddChallenges(newChallenges);
            }

            // assign ids to groups if missing
            if (template.Structure != null && template.Structure.Groups != null)
            {
                foreach (var group in template.Structure.Groups)
                {
                    if (string.IsNullOrWhiteSpace(group.GroupId))
                    {
                        group.GroupId = Guid.NewGuid().ToString();
                    }

                    if (group.Questions != null)
                    {
                        foreach (var question in group.Questions)
                        {
                            if (string.IsNullOrWhiteSpace(question.QuestionId))
                            {
                                question.QuestionId = Guid.NewGuid().ToString();
                            }
                        }
                    }
                }
            }

            await _context.SaveAsync(template);

            return Unit.Value;
        }
    }
}