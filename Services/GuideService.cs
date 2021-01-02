using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using CafApi.Models;

namespace CafApi.Services
{
    public class GuideService : IGuideService
    {
        private readonly DynamoDBContext _context;

        private readonly IInterviewService _interviewService;

        public GuideService(IAmazonDynamoDB dynamoDbClient, IInterviewService interviewService)
        {
            _context = new DynamoDBContext(dynamoDbClient);
            _interviewService = interviewService;
        }

        public async Task<List<Guide>> GetGuides(string userId)
        {
            var config = new DynamoDBOperationConfig();

            var guides = await _context.QueryAsync<Guide>(userId, config).GetRemainingAsync();
            foreach (var guide in guides)
            {
                var interviews = await _interviewService.GetGuideInterviews(guide.GuideId);
                guide.TotalInterviews = interviews.Count();
            }

            return guides;
        }

        public async Task<Guide> AddGuide(Guide guide)
        {
            guide.GuideId = Guid.NewGuid().ToString();

            if (guide.Structure != null && guide.Structure.Groups != null)
            {
                foreach (var group in guide.Structure.Groups)
                {
                    group.GroupId = Guid.NewGuid().ToString();
                }
            }

            await _context.SaveAsync(guide);

            return guide;
        }

        public async Task UpdateGuide(Guide guide)
        {
            if (guide.Structure != null && guide.Structure.Groups != null)
            {
                foreach (var group in guide.Structure.Groups)
                {
                    if (string.IsNullOrWhiteSpace(group.GroupId))
                    {
                        group.GroupId = Guid.NewGuid().ToString();
                    }
                }
            }

            await _context.SaveAsync(guide);
        }

        public async Task DeleteGuide(string userId, string guideId)
        {
            await _context.DeleteAsync<Guide>(userId, guideId);
        }
    }
}