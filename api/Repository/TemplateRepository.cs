using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.DocumentModel;
using CafApi.Models;

namespace CafApi.Repository
{
    public class TemplateRepository : ITemplateRepository
    {
        private readonly DynamoDBContext _context;

        public TemplateRepository(IAmazonDynamoDB dynamoDbClient)
        {
            _context = new DynamoDBContext(dynamoDbClient);
        }

        public async Task<Template> GetTemplate(string templateId)
        {
            var search = _context.FromQueryAsync<Template>(new QueryOperationConfig()
            {
                IndexName = "TemplateId-index",
                Filter = new QueryFilter(nameof(Template.TemplateId), QueryOperator.Equal, templateId)
            });
            var templates = await search.GetRemainingAsync();

            return templates.FirstOrDefault();
        }      
    }
}