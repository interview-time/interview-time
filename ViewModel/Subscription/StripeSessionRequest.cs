using System;

namespace CafApi.ViewModel.Subscription
{
    public class StripeSessionRequest
    {
        public string PriceId { get; set; }

        public string SuccessUrl { get; set; }

        public string CancelUrl { get; set; }

        public string Email { get; set; }
    }
}
