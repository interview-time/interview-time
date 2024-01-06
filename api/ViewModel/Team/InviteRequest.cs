using CafApi.Models;
using FluentValidation;

namespace CafApi.ViewModel
{
    public class InviteRequest
    {
        public string Email { get; set; }

        public string TeamId { get; set; }

        public string Role { get; set; }
    }

    public class InviteRequestValidator : AbstractValidator<InviteRequest>
    {
        public InviteRequestValidator()
        {
            RuleFor(x => x.Email).NotEmpty().EmailAddress();
            RuleFor(x => x.TeamId).NotEmpty();
            RuleFor(x => x.Role).NotEmpty().IsEnumName(typeof(TeamRole));
        }
    }
}