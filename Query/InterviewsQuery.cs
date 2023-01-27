using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.DocumentModel;
using CafApi.Models;
using MediatR;

namespace CafApi.Query
{
    public class InterviewsQuery : IRequest<InterviewsQueryResult>
    {
        public string TeamId { get; set; }

        public string UserId { get; set; }
    }

    public class InterviewsQueryResult
    {
        public List<Interview> Interviews { get; set; }
    }

    public class InterviewsQueryHandler : IRequestHandler<InterviewsQuery, InterviewsQueryResult>
    {
        private readonly DynamoDBContext _context;

        public InterviewsQueryHandler(IAmazonDynamoDB dynamoDbClient)
        {
            _context = new DynamoDBContext(dynamoDbClient);
        }

        public async Task<InterviewsQueryResult> Handle(InterviewsQuery query, CancellationToken cancellationToken)
        {
            if (query.TeamId != null)
            {
                var teamMember = await _context.LoadAsync<TeamMember>(query.TeamId, query.UserId);
                if (teamMember != null)
                {
                    var team = await _context.LoadAsync<Team>(query.TeamId);
                    if (team != null) // Team admin gets to see all the interviews
                    {
                        var search = _context.FromQueryAsync<Interview>(new QueryOperationConfig()
                        {
                            IndexName = "TeamId-Index",
                            Filter = new QueryFilter(nameof(Interview.TeamId), QueryOperator.Equal, query.TeamId)
                        });
                        var interviews = await search.GetRemainingAsync();

                        // Admin, Hiring Manager and HR can see all interviews conducted by any member of the team
                        if (teamMember.Roles.Any(r => r.Equals(TeamRole.INTERVIEWER.ToString())))
                        {
                            interviews = interviews.Where(i => i.UserId == query.UserId).ToList();
                            foreach (var interview in interviews)
                            {
                                if (interview.TakeHomeChallenge != null && interview.TakeHomeChallenge.IsAnonymised)
                                {
                                    interview.TakeHomeChallenge.ShareToken = null;
                                }
                            }
                        }

                        foreach (var interview in interviews)
                        {
                            if (string.IsNullOrWhiteSpace(interview.InterviewType))
                            {
                                interview.InterviewType = InterviewType.INTERVIEW.ToString();
                            }

                            // support old interviews that don't have a candidate object
                            interview.CandidateName = interview.Candidate;
                        }

                        // if interview is cancelled show it only for 7 days since the cancellation date
                        return new InterviewsQueryResult
                        {
                            Interviews = interviews
                                .Where(i => !i.IsCancelled || i.ModifiedDate > DateTime.UtcNow.AddDays(-7))
                                .ToList()
                        };
                    }
                }
            }

            var config = new DynamoDBOperationConfig();

            var myInterviews = await _context.QueryAsync<Interview>(query.UserId, config).GetRemainingAsync();
            myInterviews = myInterviews.Where(i => string.IsNullOrWhiteSpace(i.TeamId)).ToList();

            return new InterviewsQueryResult
            {
                Interviews = myInterviews
            };
        }
    }
}
