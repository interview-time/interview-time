using CafApi.Command;
using FluentValidation;

namespace CafApi.Controllers.Validators
{
    public class CreateCandidateCommandValidator : AbstractValidator<CreateCandidateCommand>
    {
        public CreateCandidateCommandValidator()
        {
            RuleFor(x => x.CandidateName).NotEmpty();
        }
    }
}