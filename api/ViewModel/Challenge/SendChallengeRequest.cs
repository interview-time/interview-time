using FluentValidation;

namespace CafApi.ViewModel
{
    public class SendChallengeRequest
    {
        public string InterviewId { get; set; }

        public bool SendViaLink { get; set; }
    }

     public class SendChallengeRequestValidator : AbstractValidator<SendChallengeRequest>
    {
        public SendChallengeRequestValidator()
        {
            RuleFor(x => x.InterviewId).NotEmpty();            
        }
    }
}
