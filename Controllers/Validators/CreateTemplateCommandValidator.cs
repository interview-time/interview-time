using CafApi.Command;
using FluentValidation;

namespace CafApi.Controllers.Validators
{
    public class CreateTemplateCommandValidator : AbstractValidator<CreateTemplateCommand>
    {
        public CreateTemplateCommandValidator()
        {
            RuleFor(x => x.Title).NotEmpty();
        }
    }
}
