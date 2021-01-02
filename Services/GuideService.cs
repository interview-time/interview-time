using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using CafApi.Models;

namespace CafApi.Services
{
    public class GuideService : IGuideService
    {
        private readonly DynamoDBContext _context;

        public GuideService(IAmazonDynamoDB dynamoDbClient)
        {
            _context = new DynamoDBContext(dynamoDbClient);
        }

        public async Task<List<Guide>> GetGuides(string userId)
        {
            var config = new DynamoDBOperationConfig();

            return await _context.QueryAsync<Guide>(userId, config).GetRemainingAsync();
        }

        public async Task<Guide> AddGuide(Guide guide)
        {
            guide.GuideId = Guid.NewGuid().ToString();
            guide.TotalInterviews = 0;

            await _context.SaveAsync(guide);

            return guide;
        }

        public async Task UpdateGuide(Guide guide)
        {
            await _context.SaveAsync(guide);
        }

        public async Task DeleteGuide(string userId, string guideId)
        {
            await _context.DeleteAsync<Guide>(userId, guideId);
        }
    }
}