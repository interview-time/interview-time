using Microsoft.AspNetCore.Mvc;

namespace CafApi.Controllers
{
    [ApiController]
    public class DefaultController : ControllerBase
    {
        [HttpGet("ping")]
        public IActionResult PingPong()
        {
            return Ok("Pong");
        }
    }
}