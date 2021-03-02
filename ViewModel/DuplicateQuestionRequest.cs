using System.ComponentModel.DataAnnotations;

namespace CafApi.ViewModel
{
    public class DuplicateQuestionRequest
    {
        [Required]
        public string CommunityCategoryId { get; set; }

        [Required]
        public string CommunityQuestionId { get; set; }

        [Required]
        public string PersonalCategory { get; set; }
    }
}