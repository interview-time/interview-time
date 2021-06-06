using System.ComponentModel.DataAnnotations;
using CafApi.Models;

namespace CafApi.ViewModel
{
    public class TemplateRequest
    {
        public string TemplateId { get; set; }

        [Required]
        public string Title { get; set; }

        public string Type { get; set; }

        public string Description { get; set; }

        public TemplateStructure Structure { get; set; }
    }
}