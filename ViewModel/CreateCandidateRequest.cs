using FluentValidation;

namespace CafApi.ViewModel
{
    public class CreateCandidateRequest
    {
        public string TeamId { get; set; }

        public string CandidateName { get; set; }

        public string Position { get; set; }

        public string ResumeFile { get; set; }

        public string LinkedIn { get; set; }

        public string GitHub { get; set; }

        public string CodingRepo { get; set; }
    }

    public class CreateCandidateRequestValidator : AbstractValidator<CreateCandidateRequest>
    {
        public CreateCandidateRequestValidator()
        {
            RuleFor(x => x.TeamId).NotEmpty();
            RuleFor(x => x.CandidateName).NotEmpty();
        }
    }
}