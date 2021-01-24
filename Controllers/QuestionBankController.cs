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

        [HttpGet()]
        public async Task<QuestionBankResponse> Get()
        {
            var questions = await _questionBankService.GetQuestionBank(UserId, null);

            var questionGroups = questions.GroupBy(q => q.Category).ToList();

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
        public async Task DeleteQuestionBank(string category)
        {
            var questions = await _questionBankService.GetQuestionBank(UserId, category);
            
            await _questionBankService.DeleteQuestionBank(questions);
        }

        [HttpPost()]
        public async Task<QuestionBank> AddQuestion([FromBody] QuestionBank questionBank)
        {
            questionBank.UserId = UserId;
            return await _questionBankService.AddQuestion(questionBank);
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