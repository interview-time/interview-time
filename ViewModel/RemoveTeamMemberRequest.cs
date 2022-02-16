using FluentValidation;

namespace CafApi.ViewModel
{
    public class RemoveTeamMemberRequest
    {
        public string TeamId { get; set; }

        public string MemberId { get; set; }
    }

    public class RemoveTeamMemberRequestValidator : AbstractValidator<RemoveTeamMemberRequest>
    {
        public RemoveTeamMemberRequestValidator()
        {
            RuleFor(x => x.TeamId).NotEmpty();
            RuleFor(x => x.MemberId).NotEmpty();
        }
    }
}