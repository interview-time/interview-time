using FluentValidation;

namespace CafApi.ViewModel
{
    public class ShareScorecardRequest
    {
        public string InterviewId { get; set; }
    }

    public class ShareScorecardRequestValidator : AbstractValidator<ShareScorecardRequest>
    {
        public ShareScorecardRequestValidator()
        {
            RuleFor(x => x.InterviewId).NotEmpty();
        }
    }
}