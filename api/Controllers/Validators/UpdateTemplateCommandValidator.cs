using CafApi.Command;
using FluentValidation;

namespace CafApi.Controllers.Validators
{
    public class UpdateTemplateCommandValidator : AbstractValidator<UpdateTemplateCommand>
    {
        public UpdateTemplateCommandValidator()
        {
            RuleFor(x => x.Title).NotEmpty();
            RuleForEach(x => x.Challenges).ChildRules(challenge =>
            {
                challenge.RuleFor(x => x.ChallengeId).NotNull();
                challenge.RuleFor(x => x.Name).NotNull();
            });

        }
    }
}