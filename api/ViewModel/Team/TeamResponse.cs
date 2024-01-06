using System.Collections.Generic;

namespace CafApi.ViewModel
{
    public class TeamResponse
    {
        public string TeamId { get; set; }

        public string TeamName { get; set; }

        public List<TeamMembersResponse> TeamMembers { get; set; }

        public List<PendingInviteResponse> PendingInvites { get; set; }

        public string Token { get; set; }

        public List<string> Roles { get; set; }

        public int Seats { get; set; }

        public string Plan { get; set; }

        public int AvailableSeats { get; set; }
    }
}