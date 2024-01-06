using CafApi.Command;
using FluentValidation;

namespace CafApi.Controllers.Validators
{
    public class ScheduleInterviewCommandValidator : AbstractValidator<ScheduleInterviewCommand>
    {
        public ScheduleInterviewCommandValidator()
        {
            RuleFor(x => x.Interviewers).NotEmpty();
        }
    }
}
