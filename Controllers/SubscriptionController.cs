using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using CafApi.ViewModel.Subscription;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Stripe;
using Stripe.Checkout;

namespace CafApi.Controllers
{
    //[Authorize]
    [ApiController]
    [Route("subscription")]
    public class SubscriptionController : ControllerBase
    {
        private readonly ILogger<SubscriptionController> _logger;
        private readonly IConfiguration _configuration;

        private string UserId
        {
            get
            {
                return User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            }
        }

        public SubscriptionController(ILogger<SubscriptionController> logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
        }

        [HttpPost("stripe-session")]
        public async Task<ActionResult> CreateStripeSession([FromForm] StripeSessionRequest request)
        {
            StripeConfiguration.ApiKey = _configuration["StripeApiKey"];

            var options = new SessionCreateOptions
            {
                // See https://stripe.com/docs/api/checkout/sessions/create
                // for additional parameters to pass.
                // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
                // the actual Session ID is returned in the query parameter when your customer
                // is redirected to the success page.
                SuccessUrl = $"{request.SuccessUrl}?session_id={{CHECKOUT_SESSION_ID}}",
                CancelUrl = request.CancelUrl,
                Mode = "subscription",
                CustomerEmail = request.Email,
                LineItems = new List<SessionLineItemOptions>
                {
                    new SessionLineItemOptions
                    {
                        Price = request.PriceId,
                        
                        AdjustableQuantity = new SessionLineItemAdjustableQuantityOptions
                        {
                            Enabled = true,
                            Minimum = 1,
                            Maximum = 50,
                        },
                        Quantity = 1,
                    },
                },
            };

            var service = new SessionService();
            var session = await service.CreateAsync(options);

            Response.Headers.Add("Location", session.Url);
            return new StatusCodeResult(303);
        }
    }
}