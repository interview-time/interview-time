using FluentValidation;

namespace CafApi.ViewModel
{
    public class AcceptInviteRequest
    {
        public string InviteToken { get; set; }
    }

    public class AcceptInviteRequestValidator : AbstractValidator<AcceptInviteRequest>
    {
        public AcceptInviteRequestValidator()
        {
            RuleFor(x => x.InviteToken).NotEmpty();
        }
    }
}