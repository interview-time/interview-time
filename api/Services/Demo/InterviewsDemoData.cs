using System;
using System.Collections.Generic;
using System.Linq;
using CafApi.Common;
using CafApi.Models;

namespace CafApi.Services.Demo
{
    public static class InterviewsDemoData
    {
        public static Interview GetCompltedScreeningInterview(string userId, string teamId, string candidateId, string templateId, string timezone)
        {
            var pastDate = DateTime.UtcNow.AddDays(-7);

            var interviewStart = new DateTime(pastDate.Year, pastDate.Month, pastDate.Day, 10, 00, 00);
            var interviewEnd = interviewStart.AddHours(1);

            var rnd = new Random();

            return new Interview
            {
                InterviewId = Guid.NewGuid().ToString(),
                LinkId = Guid.NewGuid().ToString(),
                InterviewDateTime = interviewStart.ToTimezoneTime(timezone),
                InterviewEndDateTime = interviewEnd.ToTimezoneTime(timezone),
                UserId = userId,
                TeamId = teamId,
                Interviewers = new List<string> { userId },
                CandidateId = candidateId,
                TemplateId = templateId,
                TemplateIds = new List<string> { templateId },
                IsDemo = true,
                Status = InterviewStatus.SUBMITTED.ToString(),
                CreatedDate = DateTime.UtcNow,
                ModifiedDate = DateTime.UtcNow,
                Decision = (int)Decision.Yes,
                Checklist = new List<ChecklistItem>
                {
                    new ChecklistItem
                    {
                        Item = "Review CV",
                        Checked = true
                    },
                    new ChecklistItem
                    {
                        Item = "Review LinkedIn profile",
                        Checked = true
                    }
                },
                Structure = new InterviewStructure
                {
                    Header = @"Allocate 5 min for the intro:
    - Describe the structure of the interview and what to expect
    - Tell the candidate about the company and why we're hiring for this role",
                    Groups = new List<InterviewGroup>
                    {
                        new InterviewGroup
                        {
                            Name = "Screening",
                            GroupId = Guid.NewGuid().ToString(),
                            Questions = new List<InterviewQuestion>
                            {
                               new InterviewQuestion
                                {
                                    Assessment = rnd.Next(2, 4),
                                    Question = "Do you prefer working with a team, or are you better by yourself?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"collaboration"}
                                },
                                new InterviewQuestion
                                {
                                    Assessment = rnd.Next(2, 4),
                                    Question = "Can you provide an example of when you had to work as part of a team? What were your responsibilities? How well did it work? ",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"collaboration"}
                                },
                                new InterviewQuestion
                                {
                                    Assessment = rnd.Next(2, 4),
                                    Question = "Have you ever experienced a problem with a team member? How was the situation resolved?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"collaboration"}
                                },
                                new InterviewQuestion
                                {
                                    Assessment = rnd.Next(2, 4),
                                    Question = "What types of things were you responsible for doing at your last job?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"responsibilities"}
                                },
                                new InterviewQuestion
                                {
                                    Assessment = rnd.Next(2, 4),
                                    Question = "Were there jobs you did that do not typically fall under someone’s responsibility in your job position?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"responsibilities"}
                                },
                                new InterviewQuestion
                                {
                                    Assessment = rnd.Next(2, 4),
                                    Question = "What responsibilities do you hope to have with our company?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"responsibilities"}
                                },
                                new InterviewQuestion
                                {
                                    Assessment = rnd.Next(2, 4),
                                    Question = "How do you prioritize tasks?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"organisational skills"}
                                },
                                new InterviewQuestion
                                {
                                    Assessment = rnd.Next(2, 4),
                                    Question = "Do you have experience working on more than one project at a time?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"organisational skills"}
                                },
                                new InterviewQuestion
                                {
                                    Assessment = rnd.Next(2, 4),
                                    Question = "What about this position made you want to apply?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"company"}
                                },
                                new InterviewQuestion
                                {
                                    Assessment = rnd.Next(2, 4),
                                    Question = "How familiar are you with our company and what we do?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"company"}
                                }
                            }
                        }
                    }
                }
            };
        }

        public static Interview GetCompltedNodeInterview(string userId, string teamId, string candidateId, string templateId, string timezone)
        {
            var pastDate = DateTime.UtcNow.AddDays(-2);

            var interviewStart = new DateTime(pastDate.Year, pastDate.Month, pastDate.Day, 10, 00, 00);
            var interviewEnd = interviewStart.AddHours(1);

            return new Interview
            {
                InterviewId = Guid.NewGuid().ToString(),
                LinkId = Guid.NewGuid().ToString(),
                InterviewDateTime = interviewStart.ToTimezoneTime(timezone),
                InterviewEndDateTime = interviewEnd.ToTimezoneTime(timezone),
                UserId = userId,
                TeamId = teamId,
                Interviewers = new List<string> { userId },
                CandidateId = candidateId,
                TemplateId = templateId,
                TemplateIds = new List<string> { templateId },
                IsDemo = true,
                Status = InterviewStatus.SUBMITTED.ToString(),
                CreatedDate = DateTime.UtcNow,
                ModifiedDate = DateTime.UtcNow,
                Decision = 1,
                Checklist = new List<ChecklistItem>
                {
                    new ChecklistItem
                    {
                        Item = "Review CV",
                        Checked = true
                    },
                    new ChecklistItem
                    {
                        Item = "Review LinkedIn profile",
                        Checked = true
                    }
                },
                RedFlags = new List<RedFlag>
                {
                    new RedFlag
                    {
                        Label = "was late 10 min"
                    }
                },
                Notes = "Sami is a great communicator who can clearly articulate his answers. She's weak in concurrency but she demonstrated that she's eager to learn and has a good potential.",
                Structure = new InterviewStructure
                {
                    Header = @"Allocate 5 min for the intro:
    - Describe the structure of the interview and what to expect
    - Tell the candidate about the company and why we're hiring for this role",
                    Groups = new List<InterviewGroup>
                    {
                        new InterviewGroup
                        {
                            Name = "Basics",
                            GroupId = Guid.NewGuid().ToString(),
                            Questions = new List<InterviewQuestion>
                            {
                                new InterviewQuestion
                                {
                                    Assessment = 3,
                                    Question = "What is Node.js?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"concepts"}
                                },
                                new InterviewQuestion
                                {
                                    Assessment = 3,
                                    Question = "How does Node.js work?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"concepts"}
                                },
                                new InterviewQuestion
                                {
                                    Assessment = 2,
                                    Question = "What are the pros and cons of Node.js?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"concepts"}
                                },
                                new InterviewQuestion
                                {
                                    Assessment = 2,
                                    Question = "What JavaScript engine does Node.js use?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"concepts"}
                                },
                                new InterviewQuestion
                                {
                                    Assessment = 3,
                                    Question = "What is NPM? What are the alternatives to NPM?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"concepts"}
                                }
                            }
                        },
                        new InterviewGroup
                        {
                            Name = "Core",
                            GroupId = Guid.NewGuid().ToString(),
                            Questions = new List<InterviewQuestion>
                            {
                                new InterviewQuestion
                                {
                                    Assessment = 2,
                                    Question = "Explain the concept of middleware in Node.js?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"functions"}
                                },
                               new InterviewQuestion
                                {
                                    Assessment = 2,
                                    Question = "Explain the Difference between setImmediate() vs setTimeout().",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"functions"}
                                },
                                new InterviewQuestion
                                {
                                    Assessment = 2,
                                    Question = "What is an EventEmitter in Node.js?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"callback"}
                                },
                                new InterviewQuestion
                                {
                                    Assessment = 3,
                                    Question = "What is the difference between readFile vs createReadStream in Node.js?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"streams"}
                                },
                                new InterviewQuestion
                                {
                                    Assessment = 3,
                                    Question = "Explain the concept of JIT and highlight its relation with Node.js",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"concepts"}
                                },
                                new InterviewQuestion
                                {
                                    Assessment = 2,
                                    Question = "What are streams in Node.js? What are its types?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"streams"}
                                },
                                new InterviewQuestion
                                {
                                    Assessment = 2,
                                    Question = "What is a control flow function? What are the steps does it execute?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"concepts", "functions"}
                                },
                            }
                        },
                        new InterviewGroup
                        {
                            Name = "Concurrency",
                            GroupId = Guid.NewGuid().ToString(),
                            Questions = new List<InterviewQuestion>
                            {
                                new InterviewQuestion
                                {
                                    Assessment = 2,
                                    Question = "Why is Node.js single-threaded?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"concepts", "concurrency"}
                                },
                               new InterviewQuestion
                                {
                                    Assessment = 1,
                                    Question = "Explain the event loop.",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"concepts", "concurrency"}
                                },
                                 new InterviewQuestion
                                {
                                    Assessment = 2,
                                    Question = "What is the difference between asynchronous and synchronous functions?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"concurrency", "functions"}
                                },
                                 new InterviewQuestion
                                {
                                    Assessment = -1,
                                    Question = "What is callback hell? How do you deal with it?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"callback", "concurrency"}
                                },
                                 new InterviewQuestion
                                {
                                    Assessment = 1,
                                    Question = "What is the difference between spawn() and fork() methods in Node.js?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"concurrency"}
                                },
                                 new InterviewQuestion
                                {
                                    Assessment = 0,
                                    Question = "How does sNode.js handle the child threads?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"concurrency"}
                                }
                            }
                        }
                    }
                }
            };
        }

        public static Interview GetInterviewFromTemplate(string userId, string teamId, string candidateId, Template template, string timezone)
        {
            var random = new Random();
            var now = DateTime.UtcNow.AddDays(random.Next(5, 10));

            var interviewStart = new DateTime(now.Year, now.Month, now.Day, 10, 00, 00);
            var interviewEnd = interviewStart.AddHours(1);

            return new Interview
            {
                InterviewId = Guid.NewGuid().ToString(),
                IsDemo = true,
                UserId = userId,
                TeamId = teamId,
                CandidateId = candidateId,
                TemplateId = template.TemplateId,
                TemplateIds = new List<string> { template.TemplateId },
                Interviewers = new List<string> { userId },
                LinkId = Guid.NewGuid().ToString(),
                Status = InterviewStatus.NEW.ToString(),
                InterviewDateTime = interviewStart.ToTimezoneTime(timezone),
                InterviewEndDateTime = interviewEnd.ToTimezoneTime(timezone),
                Checklist = template.Checklist,
                CreatedDate = DateTime.UtcNow,
                ModifiedDate = DateTime.UtcNow,
                Structure = new InterviewStructure
                {
                    Header = template.Structure.Header,
                    Groups = template.Structure.Groups.Select(g => new InterviewGroup
                    {
                        GroupId = Guid.NewGuid().ToString(),
                        Name = g.Name,
                        Questions = g.Questions.Select(q => new InterviewQuestion
                        {
                            QuestionId = Guid.NewGuid().ToString(),
                            Question = q.Question,
                            Difficulty = q.Difficulty,
                            Tags = q.Tags
                        }).ToList()
                    }).ToList()
                }
            };
        }
    }
}
