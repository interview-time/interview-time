using FluentValidation;

namespace CafApi.ViewModel
{
    public class CreateChallengeRequest
    {
        public string ChallengeId { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public int Order { get; set; }

        public string FileName { get; set; }

        public string GitHubUrl { get; set; }
    }

    public class CreateChallengeRequestValidator : AbstractValidator<CreateChallengeRequest>
    {
        public CreateChallengeRequestValidator()
        {
            RuleFor(x => x.ChallengeId).NotEmpty();
            RuleFor(x => x.Name).NotEmpty();
        }
    }
}
