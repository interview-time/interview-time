using System.Collections.Generic;

namespace CafApi.ViewModel
{
    public class ProfileResponse
    {
        public string UserId { get; set; }

        public string Name { get; set; }

        public string Email { get; set; }

        public int TimezoneOffset { get; set; }

        public List<TeamItemResponse> Teams { get; set; }

        public string CurrentTeamId { get; set; }
    }

    public class TeamItemResponse
    {
        public string TeamId { get; set; }

        public string TeamName { get; set; }

        public List<string> Roles { get; set; }
    }
}