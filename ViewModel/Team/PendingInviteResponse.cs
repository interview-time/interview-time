using System;

namespace CafApi.ViewModel
{
    public class PendingInviteResponse
    {
        public string InviteId { get; set; }

        public string InviteeEmail { get; set; }

        public string Role { get; set; }

        public string InvitedBy { get; set; }

        public DateTime InvitedDate { get; set; }
    }
}