using System;
using System.Collections.Generic;
using CafApi.Common;
using CafApi.Models;

namespace CafApi.Services.Demo
{
    public static class TemplatesDemoData
    {
        public static Template GetScreeningTemplate(string userId, string teamId)
        {
            return new Template
            {
                Title = "Screening",
                UserId = userId,
                TeamId = teamId,
                TemplateId = Guid.NewGuid().ToString(),
                Type = "DEVELOPMENT",
                Description = "",
                InterviewType = InterviewType.INTERVIEW.ToString(),
                IsDemo = true,
                CreatedDate = DateTime.UtcNow,
                ModifiedDate = DateTime.UtcNow,
                Token = StringHelper.GenerateToken(),
                Structure = new TemplateStructure
                {
                    Header = @"Allocate 5 min for the intro:
    - Describe the structure of the interview and what to expect
    - Tell the candidate about the company and why we're hiring for this role",
                    Groups = new List<TemplateGroup>
                    {
                        new TemplateGroup
                        {
                            Name = "Main",
                            GroupId = Guid.NewGuid().ToString(),
                            Questions = new List<QuestionItem>
                            {
                                new QuestionItem
                                {
                                    Question = "Do you prefer working with a team, or are you better by yourself?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Order = 1,
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"collaboration"}
                                },
                                new QuestionItem
                                {
                                    Question = "Can you provide an example of when you had to work as part of a team? What were your responsibilities? How well did it work? ",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Order = 2,
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"collaboration"}
                                },
                                new QuestionItem
                                {
                                    Question = "Have you ever experienced a problem with a team member? How was the situation resolved?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Order = 3,
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"collaboration"}
                                },
                                new QuestionItem
                                {
                                    Question = "What types of things were you responsible for doing at your last job?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Order = 4,
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"responsibilities"}
                                },
                                new QuestionItem
                                {
                                    Question = "Were there jobs you did that do not typically fall under someone’s responsibility in your job position?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Order = 5,
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"responsibilities"}
                                },
                                new QuestionItem
                                {
                                    Question = "What responsibilities do you hope to have with our company?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Order = 6,
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"responsibilities"}
                                },
                                new QuestionItem
                                {
                                    Question = "How do you prioritize tasks?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Order = 7,
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"organisational skills"}
                                },
                                new QuestionItem
                                {
                                    Question = "Do you have experience working on more than one project at a time?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Order = 8,
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"organisational skills"}
                                },
                                new QuestionItem
                                {
                                    Question = "What about this position made you want to apply?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Order = 9,
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"company"}
                                },
                                new QuestionItem
                                {
                                    Question = "How familiar are you with our company and what we do?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Order = 10,
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"company"}
                                },
                            }
                        }
                    }
                },
                Checklist = new List<ChecklistItem>
                {
                    new ChecklistItem
                    {
                        Item = "Review CV"
                    }
                }
            };
        }

        public static Template GetCulturalTemplate(string userId, string teamId)
        {
            return new Template
            {
                Title = "Cultural Fit",
                UserId = userId,
                TeamId = teamId,
                TemplateId = Guid.NewGuid().ToString(),
                Type = "DEVELOPMENT",
                Description = "These questions will help you to ascertain the competency and skill level of candidates. The purpose is to decide where they fall on the skill spectrum, not just for the candidate to answer the question, so keep digging until you have a clear idea of their skill.",
                InterviewType = InterviewType.INTERVIEW.ToString(),
                IsDemo = true,
                CreatedDate = DateTime.UtcNow,
                ModifiedDate = DateTime.UtcNow,
                Token = StringHelper.GenerateToken(),
                Structure = new TemplateStructure
                {
                    Header = @"Allocate 5 min for the intro:
    - Describe the structure of the interview and what to expect
    - Tell the candidate about the company and why we're hiring for this role",
                    Groups = new List<TemplateGroup>
                    {
                        new TemplateGroup
                        {
                            Name = "Delivers value fast",
                            GroupId = Guid.NewGuid().ToString(),
                            Questions = new List<QuestionItem>
                            {
                                new QuestionItem
                                {
                                    Question = "Tell me about a time you had to deliver a project under significant time pressure? What trade-offs did you have to make?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium",
                                },
                                new QuestionItem
                                {
                                    Question = "What project are you most proud of? Why are you proud if it?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium"
                                },
                                new QuestionItem
                                {
                                    Question = "If you had to ship twice as often as you currently do, what would you do differently? 10 times as often?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium"
                                },
                                new QuestionItem
                                {
                                    Question = "Give me an example of a project you were helped with in that required working with multiple teams. What challenges did you have? How did you make this work more smoothly?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium"
                                },
                                new QuestionItem
                                {
                                    Question = "When do you think you have built enough value and can ship?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium"
                                },
                                new QuestionItem
                                {
                                    Question = "How do you keep your pull requests small?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium"
                                }
                            }
                        },
                        new TemplateGroup
                        {
                            Name = "Positive influence",
                            GroupId = Guid.NewGuid().ToString(),
                            Questions = new List<QuestionItem>
                            {
                                new QuestionItem
                                {
                                    Question = "Tell me about a time you went above and beyond for your team or the broader organisation.",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium"
                                },
                                new QuestionItem
                                {
                                    Question = "Tell me about a system or process you improved that was already working well.",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium"
                                },
                                new QuestionItem
                                {
                                    Question = "Describe an improvement you made to the way your team works. What was the outcome?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium"
                                },
                                new QuestionItem
                                {
                                    Question = "How have you created relationships with other people outside your immediate team.",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium"
                                },
                                new QuestionItem
                                {
                                    Question = "Give me an example where you solved a problem that was not your job.",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium"
                                }
                            }
                        },
                        new TemplateGroup
                        {
                            Name = "Owns what they build",
                            GroupId = Guid.NewGuid().ToString(),
                            Questions = new List<QuestionItem>
                            {
                                new QuestionItem
                                {
                                    Question = "In terms of code you or your team wrote, where do you think your ownership ends?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium"
                                },
                                new QuestionItem
                                {
                                    Question = "Tell me about a time you built something with some issues after launch, and what did you do? How did you prevent that type of problem reappearing in future launches?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium"
                                },
                                new QuestionItem
                                {
                                    Question = "Tell me about a time you had to solve a problem in a live system. How did you know there was a problem? How did you enlist others to help? How did you prevent this problem from occurring again?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium"
                                },
                            }
                        },
                        new TemplateGroup
                        {
                            Name = "Curious",
                            GroupId = Guid.NewGuid().ToString(),
                            Questions = new List<QuestionItem>
                            {
                                new QuestionItem
                                {
                                    Question = "Tell me about a time you disagreed with your team, and they were right. What was the situation, and the outcome?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium"
                                },
                                new QuestionItem
                                {
                                    Question = "Tell me about a situation where you were right, but your team decided something else.",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium"
                                },
                                new QuestionItem
                                {
                                    Question = "Describe the last piece of information or lesson you shared with your team or a broader group. How did you share it?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium"
                                },
                                new QuestionItem
                                {
                                    Question = "Describe something you have taught to others in your organisation.",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium"
                                }
                            }
                        },
                        new TemplateGroup
                        {
                            Name = "Understands the business outcome",
                            GroupId = Guid.NewGuid().ToString(),
                            Questions = new List<QuestionItem>
                            {
                                new QuestionItem
                                {
                                    Question = "In your current or last role, who are your customers? What do they value the most? Why do they value that?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium"
                                },
                                new QuestionItem
                                {
                                    Question = "How do you know you are personally delivering value to your customers? How do you find out this for yourself, beyond any specification?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium"
                                },
                                new QuestionItem
                                {
                                    Question = "What is success for your team look like? How do you make your team more successful?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium"
                                },
                                new QuestionItem
                                {
                                    Question = "Describe a time to solve a problem you had to learn the business or problem domain beyond the code.",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium"
                                }
                            }
                        },
                        new TemplateGroup
                        {
                            Name = "Deals with ambiguous problems",
                            GroupId = Guid.NewGuid().ToString(),
                            Questions = new List<QuestionItem>
                            {
                                new QuestionItem
                                {
                                    Question = "Describe a time you had to solve an ambiguous problem. What made it ambiguous?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium"
                                },
                                new QuestionItem
                                {
                                    Question = "Give me an example where you were handed an ambiguous problem. How did you make it less ambiguous?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium"
                                },
                                new QuestionItem
                                {
                                    Question = "You need to work on a task, but the requirements are not quite clear. What do you do?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Difficulty = "Medium"
                                }
                            }
                        },
                    }
                },
                Checklist = new List<ChecklistItem>
                {
                    new ChecklistItem
                    {
                        Item = "Review CV"
                    }
                }
            };
        }

        public static Template GetNodeTemplate(string userId, string teamId)
        {
            return new Template
            {
                TemplateId = Guid.NewGuid().ToString(),
                UserId = userId,
                TeamId = teamId,
                Title = "Node.js Engineer",
                Type = "DEVELOPMENT",
                Description = "",
                InterviewType = InterviewType.INTERVIEW.ToString(),
                IsDemo = true,
                CreatedDate = DateTime.UtcNow,
                ModifiedDate = DateTime.UtcNow,
                Token = StringHelper.GenerateToken(),
                Structure = new TemplateStructure
                {
                    Header = @"Allocate 5 min for the intro:
    - Describe the structure of the interview and what to expect
    - Tell the candidate about the company and why we're hiring for this role",
                    Groups = new List<TemplateGroup>
                    {
                        new TemplateGroup
                        {
                            Name = "Basics",
                            GroupId = Guid.NewGuid().ToString(),
                            Questions = new List<QuestionItem>
                            {
                                new QuestionItem
                                {
                                    Question = "What is Node.js?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Order = 1,
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"concepts"}
                                },
                                new QuestionItem
                                {
                                    Question = "How does Node.js work?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Order = 2,
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"concepts"}
                                },
                                new QuestionItem
                                {
                                    Question = "What are the pros and cons of Node.js?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Order = 3,
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"concepts"}
                                },
                                new QuestionItem
                                {
                                    Question = "What JavaScript engine does Node.js use?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Order = 4,
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"concepts"}
                                },
                                new QuestionItem
                                {
                                    Question = "What is NPM? What are the alternatives to NPM?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Order = 5,
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"concepts"}
                                }
                            }
                        },
                        new TemplateGroup
                        {
                            Name = "Core",
                            GroupId = Guid.NewGuid().ToString(),
                            Questions = new List<QuestionItem>
                            {
                                new QuestionItem
                                {
                                    Question = "Explain the concept of middleware in Node.js?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Order = 1,
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"functions"}
                                },
                               new QuestionItem
                                {
                                    Question = "Explain the Difference between setImmediate() vs setTimeout().",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Order = 2,
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"functions"}
                                },
                                new QuestionItem
                                {
                                    Question = "What is an EventEmitter in Node.js?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Order = 3,
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"callback"}
                                },
                                new QuestionItem
                                {
                                    Question = "What is the difference between readFile vs createReadStream in Node.js?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Order = 4,
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"streams"}
                                },
                                new QuestionItem
                                {
                                    Question = "Explain the concept of JIT and highlight its relation with Node.js",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Order = 5,
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"concepts"}
                                },
                                new QuestionItem
                                {
                                    Question = "What are streams in Node.js? What are its types?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Order = 6,
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"streams"}
                                },
                                new QuestionItem
                                {
                                    Question = "What is a control flow function? What are the steps does it execute?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Order = 7,
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"concepts", "functions"}
                                },
                            }
                        },
                        new TemplateGroup
                        {
                            Name = "Concurrency",
                            GroupId = Guid.NewGuid().ToString(),
                            Questions = new List<QuestionItem>
                            {
                                new QuestionItem
                                {
                                    Question = "Why is Node.js single-threaded?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Order = 1,
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"concepts", "concurrency"}
                                },
                               new QuestionItem
                                {
                                    Question = "Explain the event loop.",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Order = 2,
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"concepts", "concurrency"}
                                },
                                 new QuestionItem
                                {
                                    Question = "What is the difference between asynchronous and synchronous functions?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Order = 3,
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"concurrency", "functions"}
                                },
                                 new QuestionItem
                                {
                                    Question = "What is callback hell? How do you deal with it?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Order = 4,
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"callback", "concurrency"}
                                },
                                 new QuestionItem
                                {
                                    Question = "What is the difference between spawn() and fork() methods in Node.js?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Order = 5,
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"concurrency"}
                                },
                                 new QuestionItem
                                {
                                    Question = "How does sNode.js handle the child threads?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Order = 6,
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"concurrency"}
                                }
                            }
                        }
                    }
                },
                Checklist = new List<ChecklistItem>
                {
                    new ChecklistItem
                    {
                        Item = "Review CV"
                    },
                    new ChecklistItem
                    {
                        Item = "Review LinkedIn profile"
                    }
                }
            };
        }
    }
}
