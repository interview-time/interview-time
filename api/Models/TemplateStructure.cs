using System.Collections.Generic;

namespace CafApi.Models
{
    public class TemplateStructure
    {
        public string Header { get; set; }

        public string Footer { get; set; }

        public List<TemplateGroup> Groups { get; set; }
    }

    public class TemplateGroup
    {
        public string GroupId { get; set; }

        public string Name { get; set; }

        public List<QuestionItem> Questions { get; set; }
    }

    public class QuestionItem
    {
        public string QuestionId { get; set; }

        public string Question { get; set; }

        public int Order { get; set; }

        public string Difficulty { get; set; }

        public List<string> Tags { get; set; }
    }
}
