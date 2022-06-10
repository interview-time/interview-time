using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using CafApi.Models;
using CafApi.Services;
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
    [Route("payments")]
    public class PaymentsController : ControllerBase
    {
        private readonly ILogger<PaymentsController> _logger;
        private readonly IConfiguration _configuration;
        private readonly ITeamService _teamService;

        private string UserId
        {
            get
            {
                return User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            }
        }

        public PaymentsController(
            ILogger<PaymentsController> logger,
            IConfiguration configuration,
            ITeamService teamService)
        {
            _logger = logger;
            _configuration = configuration;
            _teamService = teamService;
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
                ClientReferenceId = request.TeamId,
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

        [HttpPost("webhook")]
        public async Task<IActionResult> Webhook()
        {
            StripeConfiguration.ApiKey = _configuration["Stripe:ApiKey"];

            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            Event stripeEvent;
            try
            {
                stripeEvent = EventUtility.ConstructEvent(
                    json,
                    Request.Headers["Stripe-Signature"],
                    _configuration["Stripe:WebhookSecret"]
                );

                _logger.LogInformation($"Webhook notification with type: {stripeEvent.Type} found for {stripeEvent.Id}");
            }
            catch (Exception e)
            {
                _logger.LogError($"stripe webhook failed {e}");
                return BadRequest();
            }

            switch (stripeEvent.Type)
            {
                case Events.CheckoutSessionCompleted:

                    _logger.LogInformation("Payment is successful and the subscription is created.");

                    var checkoutSession = stripeEvent.Data.Object as Stripe.Checkout.Session;
                    await _teamService.UpdateSubscription(checkoutSession.ClientReferenceId, SubscriptionPlan.PREMIUM, checkoutSession.LineItems.Count(), checkoutSession.Customer.Id);

                    break;

                case Events.InvoicePaid:
                    _logger.LogInformation("Continue to provision the subscription as payments continue to be made");

                    // Store the status in your database and check when a user accesses your service.
                    // This approach helps you avoid hitting rate limits.
                    break;

                case Events.InvoicePaymentFailed:
                    _logger.LogError("The payment failed or the customer does not have a valid payment method.");

                    // 
                    // The subscription becomes past_due. Notify your customer and send them to the
                    // customer portal to update their payment information.
                    break;
            }

            return Ok();
        }
    }
}