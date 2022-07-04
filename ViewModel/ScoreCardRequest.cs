using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using CafApi.Models;

namespace CafApi.ViewModel
{
    public class ScoreCardRequest
    {
        [Required]
        public string InterviewId { get; set; }

        public string Notes { get; set; }

        public List<RedFlag> RedFlags { get; set; }

        [Required]
        public int Decision { get; set; }

        [Required]
        public string Status { get; set; }

        public List<QuestionGroupResult> QuestionGroups { get; set; }
    }

    public class QuestionGroupResult
    {
        [Required]
        public string GroupId { get; set; }

        public string Notes { get; set; }

        [Required]
        public int Assessment { get; set; }

        public List<QuestionResult> Questions { get; set; }
    }

    public class QuestionResult
    {
        [Required]
        public string QuestionId { get; set; }

        [Required]
        public int Assessment { get; set; }
    }
}