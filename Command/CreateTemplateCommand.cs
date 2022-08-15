using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using CafApi.Common;
using CafApi.Models;
using CafApi.Services.User;
using MediatR;
using Microsoft.Extensions.Configuration;

namespace CafApi.Command
{
    public class CreateTemplateCommand : IRequest<Template>
    {
        public bool IsDemo { get; set; }

        public string UserId { get; set; }

        public string TemplateId { get; set; }

        public string Title { get; set; }

        public string Type { get; set; }

        public string InterviewType { get; set; }

        public string Description { get; set; }

        public string Image { get; set; }

        public string TeamId { get; set; }

        public TemplateStructure Structure { get; set; }

        public List<string> ChallengeIds { get; set; }

        public List<Challenge> Challenges { get; set; }
    }

    public class CreateTemplateCommandHandler : IRequestHandler<CreateTemplateCommand, Template>
    {
        private readonly IPermissionsService _permissionsService;
        private readonly DynamoDBContext _context;
        private readonly string _demoUserId;

        public CreateTemplateCommandHandler(IPermissionsService permissionsService, IAmazonDynamoDB dynamoDbClient, IConfiguration configuration)
        {
            _permissionsService = permissionsService;
            _context = new DynamoDBContext(dynamoDbClient);
            _demoUserId = configuration["DemoUserId"];
        }

        public async Task<Template> Handle(CreateTemplateCommand request, CancellationToken cancellationToken)
        {
            if (!await _permissionsService.IsBelongInTeam(request.UserId, request.TeamId))
            {
                throw new AuthorizationException($"User ({request.UserId}) doesn't belong to the team ({request.TeamId})");
            }

            var template = new Template
            {
                UserId = request.UserId,
                TemplateId = Guid.NewGuid().ToString(),
                Title = request.Title,
                Type = request.Type,
                InterviewType = request.InterviewType ?? InterviewType.INTERVIEW.ToString(),
                Description = request.Description,
                Structure = request.Structure,
                IsDemo = request.UserId == _demoUserId,
                TeamId = request.TeamId,
                ChallengeIds = request.ChallengeIds,
                CreatedDate = DateTime.UtcNow,
                ModifiedDate = DateTime.UtcNow,
                Token = StringHelper.GenerateToken(),
                Challenges = request.Challenges
            };

            // assign ids to groups if missing
            if (template.Structure != null && template.Structure.Groups != null)
            {
                foreach (var group in template.Structure.Groups)
                {
                    group.GroupId = Guid.NewGuid().ToString();

                    if (group.Questions != null)
                    {
                        foreach (var question in group.Questions)
                        {
                            question.QuestionId = Guid.NewGuid().ToString();
                        }
                    }
                }
            }

            await _context.SaveAsync(template);

            return template;
        }
    }
}