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
    [Route("question-bank")]
    public class QuestionBankController : ControllerBase
    {
        private readonly IQuestionBankService _questionBankService;
        private readonly ILogger<QuestionBankController> _logger;
        private string UserId
        {
            get
            {
                return User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            }
        }

        public QuestionBankController(ILogger<QuestionBankController> logger, IQuestionBankService questionBankService)
        {
            _logger = logger;
            _questionBankService = questionBankService;
        }

        [HttpGet("categories")]
        public async Task<List<Category>> GetCategories()
        {
            var categories = await _questionBankService.GetCategories(UserId);

            return categories;
        }

        [HttpPost("category")]
        public async Task<Category> AddCategory([FromBody] string categoryName)
        {
            return await _questionBankService.AddCategory(UserId, categoryName);
        }

        [HttpPut("category")]
        public async Task UpdateCategory([FromBody] Category category)
        {
            await _questionBankService.UpdateCategory(category);
        }

        [HttpDelete("category/{categoryId}")]
        public async Task DeleteCategory(string categoryId)
        {
            await _questionBankService.DeleteCategory(UserId, categoryId);
        }

        [HttpGet("new")]
        public async Task<QuestionsResponse> GetQuestions()
        {
            var questions = await _questionBankService.GetQuestions(UserId);
            var categories = await _questionBankService.GetCategories(UserId, questions);

            return new QuestionsResponse
            {
                Categories = categories,
                Questions = questions
            };
        }

        [HttpGet()]
        public async Task<QuestionBankResponse> Get()
        {
            var questions = await _questionBankService.GetQuestionBank(UserId);            

            return new QuestionBankResponse
            {
                Categories = questions.GroupBy(q => q.Category).Select(q => q.Key).ToList(),
                Questions = questions
            };
        }

        [HttpGet("{category}")]
        public async Task<IEnumerable<QuestionBank>> Get(string category)
        {
            return await _questionBankService.GetQuestionBank(UserId, category);
        }

        [HttpDelete("category/{category}")]
        public async Task Delete(string category)
        {
            var questions = await _questionBankService.GetQuestionBank(UserId, category);

            await _questionBankService.DeleteQuestionBank(questions);
        }

        [HttpPost("category/{category}/{newCategory}")]
        public async Task Update(string category, string newCategory)
        {
            var questions = await _questionBankService.GetQuestionBank(UserId, category);

            foreach (var question in questions)
            {
                question.Category = newCategory;
            }

            await _questionBankService.UpdateQuestionBank(questions);
        }

        [HttpPost()]
        public async Task<QuestionBank> AddQuestion([FromBody] QuestionBank questionBank)
        {
            questionBank.UserId = UserId;
            return await _questionBankService.AddQuestion(questionBank);
        }

        [HttpPost("questions")]
        public async Task AddQuestion([FromBody] List<QuestionBank> questions)
        {
            foreach (var question in questions)
            {
                question.UserId = UserId;
            }
            await _questionBankService.AddQuestions(questions);
        }

        [HttpDelete("{questionId}")]
        public async Task DeleteQuestion(string questionId)
        {
            await _questionBankService.DeleteQuestion(UserId, questionId);
        }

        [HttpPut()]
        public async Task UpdateQuestion([FromBody] QuestionBank questionBank)
        {
            questionBank.UserId = UserId;
            await _questionBankService.UpdateQuestion(questionBank);
        }
    }
}