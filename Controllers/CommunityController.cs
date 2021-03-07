using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using CafApi.Models;
using CafApi.Services;
using CafApi.ViewModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace CafApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("community")]
    public class CommunityController : ControllerBase
    {
        private readonly ICommunityService _communityService;
        private readonly ILogger<CommunityController> _logger;

        private string UserId
        {
            get
            {
                return User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            }
        }

        public CommunityController(ILogger<CommunityController> logger, ICommunityService communityService)
        {
            _logger = logger;
            _communityService = communityService;
        }

        [HttpGet("categories")]
        public async Task<List<CommunityCategoryResponse>> GetCategories()
        {
            var categories = await _communityService.GetAllCategories();

            return categories.Select(c => new CommunityCategoryResponse
            {
                Id = c.CategoryId,
                Name = c.CategoryName,
                Image = c.Image
            }).ToList();
        }

        [HttpGet("categories/questions")]
        public async Task<List<CommunityCategoryQuestionsResponse>> GetCategoriesWithQuestions()
        {
            var responses = new List<CommunityCategoryQuestionsResponse>();

            var categories = await _communityService.GetAllCategories();

            foreach (var category in categories)
            {
                var response = new CommunityCategoryQuestionsResponse();
                response.Category = category;
                response.Questions = await Get(category.CategoryId);

                responses.Add(response);
            }

            return responses; 
        }

        [HttpGet("{categoryId}")]
        public async Task<IEnumerable<CommunityQuestion>> Get(string categoryId)
        {
            return await _communityService.GetQuestions(categoryId);
        }

        [HttpPost("contribute")]
        public async Task<CommunityQuestion> ContributeQuestion([FromBody] ContributeQuestionRequest request)
        {
            return await _communityService.ContributeQuestion(UserId, request.PersonalQuestionId, request.CommunityCategoryId);
        }

        [HttpPost("duplicate")]
        public async Task<QuestionBank> DuplicateQuestion([FromBody] DuplicateQuestionRequest request)
        {
            return await _communityService.DuplicateQuestion(request.CommunityCategoryId, request.CommunityQuestionId, UserId, request.PersonalCategory);
        }

        [HttpDelete("{categoryId}/{questionId}")]
        public async Task DeleteQuestion(string categoryId, string questionId)
        {
            await _communityService.DeleteQuestion(categoryId, questionId);
        }

        [HttpPost("question")]
        public async Task AddQuestion([FromBody] CommunityQuestion question)
        {
            await _communityService.AddQuestion(question);
        }

        [HttpPut("question")]
        public async Task UpdateQuestion([FromBody] CommunityQuestion question)
        {
            await _communityService.UpdateQuestion(question);
        }

        [HttpPost("category")]
        public async Task<CommunityCategory> AddCategory([FromBody] CommunityCategory category)
        {
            return await _communityService.AddCategory(category);
        }

        [HttpPut("category")]
        public async Task UpdateCategory([FromBody] CommunityCategory category)
        {
            await _communityService.UpdateCategory(category);
        }
    }
}