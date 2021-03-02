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