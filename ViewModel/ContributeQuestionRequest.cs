using System.ComponentModel.DataAnnotations;

namespace CafApi.ViewModel
{
    public class ContributeQuestionRequest
    {
        [Required]
        public string PersonalQuestionId { get; set; }

        [Required]
        public string CommunityCategoryId { get; set; }
    }
}