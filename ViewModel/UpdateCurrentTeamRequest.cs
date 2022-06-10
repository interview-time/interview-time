using FluentValidation;

namespace CafApi.ViewModel
{
    public class UpdateUserRequest
    {
        public string Name { get; set; }

        public string Position { get; set; }

        public int TimezoneOffset { get; set; }

        public string Timezone { get; set; }
    }

    public class UpdateUserRequestValidator : AbstractValidator<UpdateUserRequest>
    {
        public UpdateUserRequestValidator()
        {
            RuleFor(x => x.Name).NotEmpty();
            RuleFor(x => x.Timezone).NotEmpty();
        }
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