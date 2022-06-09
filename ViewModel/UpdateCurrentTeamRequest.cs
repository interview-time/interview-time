using FluentValidation;

namespace CafApi.ViewModel
{
    public class UpdateUserRequest
    {
        public string Name { get; set; }

        public string Email { get; set; }

        public string Position { get; set; }

        public int TimezoneOffset { get; set; }

        public string Timezone { get; set; }

        public string CurrentTeamId { get; set; }
    }

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