using System.ComponentModel.DataAnnotations;

namespace CafApi.ViewModel
{
    public class CreateTeamRequest
    {
        [Required]
        public string TeamName { get; set; }
    }
}