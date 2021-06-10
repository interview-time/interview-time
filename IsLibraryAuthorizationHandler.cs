using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace CafApi
{
    public class IsLibraryAuthorizationHandler : AuthorizationHandler<IsLibraryAuthorizationRequirement>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsLibraryAuthorizationRequirement requirement)
        {
            var permission = context.User?.Claims?.FirstOrDefault(x => x.Type == "permissions" && x.Value == requirement.ValidPermission);
            if (permission != null)
                context.Succeed(requirement);

            return Task.CompletedTask;
        }
    }
    
    public class IsLibraryAuthorizationRequirement : IAuthorizationRequirement
    {
        public string ValidPermission = "write:library";
    }
}
