using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CafApi.Models;

namespace CafApi.Services.Demo
{
    public static class DemoData
    {
        public static List<Candidate> Candidates = new List<Candidate>
        {
            new Candidate
            {
                FirstName = "John",
                LastName = "Smith",
                CandidateName = "John Smith",
                Position = "JavaScript Engineer",
                Location = "Sydney, Australia",
                Email = "john.smith@company.com",
                Phone = "555-222-444",
                LinkedIn = "https://www.linkedin.com/",
                GitHub = "https://github.com/",
                IsDemo = true
            },
            new Candidate
            {
                FirstName = "John",
                LastName = "Smith",
                CandidateName = "John Smith",
                Position = "JavaScript Engineer",
                Location = "Sydney, Australia",
                Email = "john.smith@company.com",
                Phone = "555-222-444",
                LinkedIn = "https://www.linkedin.com/",
                GitHub = "https://github.com/",
                IsDemo = true
            }
        };

        public static List<Interview> Interviews = new List<Interview> {
            new Interview
            {

            }
        };

        public static List<Template> Templates = new List<Template>
        {
            new Template
            {
                Title = "JavaScript Engineer",
                Type  = "DEVELOPMENT",
                Description = "",
                InterviewType =  InterviewType.INTERVIEW.ToString(),
                IsDemo = true,
                Structure = new TemplateStructure
                {
                    Header = @"Allocate 5 min for the intro:
                                - Describe the structure of the interview and what to expect
                                - Tell the candidate about the company and why we're hiring for this role",
                    Groups = new List<TemplateGroup>
                    {                        
                        new TemplateGroup
                        {
Name = "Language",
Questions = new List<QuestionItem>
{
    new QuestionItem
    {
        Question = "",
        Order = 1,
        Difficulty = "",
        
    }
}
                        }
                    }
                },
                Checklist = new List<ChecklistItem>
                {
                    new ChecklistItem
                    {
                        Item = "Say hi"
                    }
                }
            }
        };
    }
}