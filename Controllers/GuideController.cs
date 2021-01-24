using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using CafApi.Models;
using CafApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace CafApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("guide")]
    public class GuideController : ControllerBase
    {
        private readonly IGuideService _guideService;
        private readonly ILogger<GuideController> _logger;
        private string UserId
        {
            get
            {
                return User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            }
        }

        public GuideController(ILogger<GuideController> logger, IGuideService guideService)
        {
            _logger = logger;
            _guideService = guideService;
        }

        [HttpGet()]
        public async Task<List<Guide>> Get()
        {
            var guides = await _guideService.GetGuides(UserId);

            return guides;
        }

        [HttpPost()]
        public async Task<Guide> AddGuide([FromBody] Guide guide)
        {
            guide.UserId = UserId;
            return await _guideService.AddGuide(guide);
        }

        [HttpDelete("{guideId}")]
        public async Task DeleteGuide(string guideId)
        {
            await _guideService.DeleteGuide(UserId, guideId);
        }

        [HttpPut()]
        public async Task UpdateGuide([FromBody] Guide guide)
        {
            guide.UserId = UserId;
            await _guideService.UpdateGuide(guide);
        }
    }
}