using CafApi.Models;
using FluentValidation;

namespace CafApi.ViewModel
{
    public class ChangeMemberRoleRequest
    {
        public string TeamId { get; set; }

        public string MemberId { get; set; }

        public string NewRole { get; set; }
    }

    public class ChangeMemberRoleRequestValidator : AbstractValidator<ChangeMemberRoleRequest>
    {
        public ChangeMemberRoleRequestValidator()
        {
            RuleFor(x => x.TeamId).NotEmpty();
            RuleFor(x => x.MemberId).NotEmpty();
            RuleFor(x => x.NewRole).NotEmpty().IsEnumName(typeof(TeamRole));
        }
    }
}