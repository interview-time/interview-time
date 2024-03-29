using System.Collections.Generic;

namespace CafApi.ViewModel
{
    public class TeamMembersResponse
    {
        public string UserId { get; set; }

        public string Name { get; set; }

        public string Email { get; set; }

        public bool IsAdmin { get; set; }

        public List<string> Roles { get; set; }
    }
}