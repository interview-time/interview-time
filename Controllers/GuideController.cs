using System.Collections.Generic;
using System.Threading.Tasks;
using CafApi.Models;
using CafApi.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace CafApi.Controllers
{
    [ApiController]
    [Route("guide")]
    public class GuideController : ControllerBase
    {
        private readonly IGuideService _guideService;
        private readonly ILogger<GuideController> _logger;
        private readonly string _userId = "a653da88-78d6-4cad-a24c-33a9d7a87a69";

        public GuideController(ILogger<GuideController> logger, IGuideService guideService)
        {
            _logger = logger;
            _guideService = guideService;
        }

        [HttpGet()]
        public async Task<List<Guide>> Get()
        {
            var guides = await _guideService.GetGuides(_userId);

            return guides;
        }

        [HttpPost()]
        public async Task<Guide> AddGuide([FromBody] Guide guide)
        {
            guide.UserId = _userId;
            return await _guideService.AddGuide(guide);
        }

        [HttpDelete("{guideId}")]
        public async Task DeleteGuide(string guideId)
        {
            await _guideService.DeleteGuide(_userId, guideId);
        }

        [HttpPut()]
        public async Task UpdateGuide([FromBody] Guide guide)
        {
            guide.UserId = _userId;
            await _guideService.UpdateGuide(guide);
        }
    }
}