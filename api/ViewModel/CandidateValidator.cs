using CafApi.Models;
using FluentValidation;

namespace CafApi.ViewModel
{
    public class CandidateValidator : AbstractValidator<Candidate>
    {
        public CandidateValidator()
        {
            RuleFor(x => x.TeamId).NotEmpty();
            RuleFor(x => x.CandidateId).NotEmpty();
            RuleFor(x => x.CandidateName).NotEmpty();
        }
    }
}