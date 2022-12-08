using System;
using System.Collections.Generic;
using CafApi.Common;
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
                IsDemo = true,
                Status = CandidateStatus.NEW.ToString(),
                CreatedDate = DateTime.UtcNow
            },
            new Candidate
            {
                FirstName = "Sami",
                LastName = "Yao",
                CandidateName = "Sami Yao",
                Position = "Node.js Engineer",
                Location = "Sydney, Australia",
                Email = "sami.yao@company.com",
                Phone = "444-224-888",
                LinkedIn = "https://www.linkedin.com/",
                GitHub = "https://github.com/",
                IsDemo = true,
                Status = CandidateStatus.NEW.ToString(),
                CreatedDate = DateTime.UtcNow
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
                TemplateId = Guid.NewGuid().ToString(),
                Type  = "DEVELOPMENT",
                Description = "",
                InterviewType =  InterviewType.INTERVIEW.ToString(),
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
                            Name = "Language",
                            GroupId = Guid.NewGuid().ToString(),
                            Questions = new List<QuestionItem>
                            {
                                new QuestionItem
                                {
                                    Question = "How can you share code between files?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Order = 1,
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"concepts"}
                                },
                                new QuestionItem
                                {
                                    Question = "What is the definition of a higher-order function?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Order = 2,
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"function"}
                                },
                                new QuestionItem
                                {
                                    Question = "Explain event delegation",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Order = 3,
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"dom", "event"}
                                },
                                new QuestionItem
                                {
                                    Question = "What's the difference between feature detection, feature inference, and using the UA string?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Order = 4,
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"concepts"}
                                },
                                new QuestionItem
                                {
                                    Question = "Explain the difference between mutable and immutable objects.",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Order = 5,
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"object"}
                                },
                                new QuestionItem
                                {
                                    Question = "What is the difference between == and ===?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Order = 6,
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"object"}
                                },
                                new QuestionItem
                                {
                                    Question = "How do you organize your code? (module pattern, classical inheritance?)",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Order = 7,
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"concepts"}
                                },
                                new QuestionItem
                                {
                                    Question = "What are the pros and cons of using Promises instead of callbacks?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Order = 8,
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"concurrency"}
                                },
                                new QuestionItem
                                {
                                    Question = "Explain 'Function.prototype.bind'.",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Order = 9,
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"function"}
                                },
                                new QuestionItem
                                {
                                    Question = "Explain the same-origin policy with regards to JavaScript.",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Order = 10,
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"concepts"}
                                },
                                new QuestionItem
                                {
                                    Question = "What are the differences between variables created using let, var or const?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Order = 11,
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"variables"}
                                },
                                new QuestionItem
                                {
                                    Question = "Why you might want to create static class members?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Order = 12,
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"object", "properties"}
                                },
                                new QuestionItem
                                {
                                    Question = "What's the difference between a variable that is: null, undefined or undeclared? How would you go about checking for any of these states?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Order = 13,
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"variables"}
                                },
                                new QuestionItem
                                {
                                    Question = "Explain 'hoisting'.",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Order = 14,
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"variables"}
                                },
                                new QuestionItem
                                {
                                    Question = "Explain the difference between synchronous and asynchronous functions.",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Order = 15,
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"concurrency"}
                                },
                                new QuestionItem
                                {
                                    Question = "Why is extending built-in JavaScript objects not a good idea?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Order = 16,
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"object"}
                                },
                                new QuestionItem
                                {
                                    Question = "Explain how 'this' works in JavaScript",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Order = 17,
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"concepts"}
                                },
                                new QuestionItem
                                {
                                    Question = "What is a closure, and how/why would you use one?",
                                    QuestionId = Guid.NewGuid().ToString(),
                                    Order = 18,
                                    Difficulty = "Medium",
                                    Tags = new List<string> {"function"}
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
                    },
                    new ChecklistItem
                    {
                        Item = "Review LinkedIn profile"
                    }
                }
            },
            new Template
            {
                TemplateId = Guid.NewGuid().ToString(),
                Title = "Node.js Engineer",
                Type  = "DEVELOPMENT",
                Description = "",
                InterviewType =  InterviewType.INTERVIEW.ToString(),
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
            }
        };
    }
}