using CafApi.Models;

namespace CafApi.ViewModel
{
    public class SharedTemplateResponse
    {
        public string TemplateId { get; set; }

        public string Title { get; set; }

        public string Image { get; set; }

        public string Type { get; set; }

        public string Description { get; set; }

        public int TotalInterviews { get; set; }
   
        public string Owner { get; set; }

        public TemplateStructure Structure { get; set; }
    }
}