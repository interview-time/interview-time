using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CafApi.Models;
using CafApi.Services;
using CafApi.ViewModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace CafApi.Controllers
{
    [ApiController]
    [Route("question-bank")]
    public class QuestionBankController : ControllerBase
    {
        private readonly IQuestionBankService _questionBankService;
        private readonly ILogger<QuestionBankController> _logger;
        private readonly string _userId = "a653da88-78d6-4cad-a24c-33a9d7a87a69";

        public QuestionBankController(ILogger<QuestionBankController> logger, IQuestionBankService questionBankService)
        {
            _logger = logger;
            _questionBankService = questionBankService;
        }

        [HttpGet()]
        public async Task<IEnumerable<CategoryResponse>> Get()
        {
            var questions = await _questionBankService.GetQuestionBank(_userId, null);

            return questions.GroupBy(q => q.Category).Select(g => new CategoryResponse
            {
                CategoryName = g.Key,
                Questions = g.ToList()
            }).ToList();
        }

        [HttpGet("{category}")]
        public async Task<IEnumerable<QuestionBank>> Get(string category)
        {
            return await _questionBankService.GetQuestionBank(_userId, category);
        }

        [HttpPost("question")]
        public async Task<QuestionBank> AddQuestion([FromBody] QuestionBank questionBank)
        {
            questionBank.UserId = _userId;
            return await _questionBankService.AddQuestion(questionBank);
        }

        [HttpDelete("question/{questionId}")]
        public async Task DeleteQuestion(string questionId)
        {
            await _questionBankService.DeleteQuestion(_userId, questionId);
        }

        [HttpPut("question")]
        public async Task UpdateQuestion([FromBody] QuestionBank questionBank)
        {
            questionBank.UserId = _userId;
            await _questionBankService.UpdateQuestion(questionBank);
        }
    }
}