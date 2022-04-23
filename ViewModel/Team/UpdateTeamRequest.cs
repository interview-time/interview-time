using System.ComponentModel.DataAnnotations;

namespace CafApi.ViewModel
{
    public class UpdateTeamRequest
    {
        [Required]
        public string TeamId { get; set; }

        [Required]
        public string TeamName { get; set; }
    }
}