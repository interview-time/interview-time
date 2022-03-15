using FluentValidation;

namespace CafApi.ViewModel
{
    public class UpdateCurrentTeamRequest
    {
        public string CurrentTeamId { get; set; }
    }

    public class UpdateCurrentTeamRequestValidator : AbstractValidator<UpdateCurrentTeamRequest>
    {
        public UpdateCurrentTeamRequestValidator()
        {
            RuleFor(x => x.CurrentTeamId).NotEmpty();
        }
    }
}