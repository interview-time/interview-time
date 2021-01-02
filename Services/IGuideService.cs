using System.Collections.Generic;
using System.Threading.Tasks;
using CafApi.Models;

namespace CafApi.Services
{
    public interface IGuideService
    {
        Task<List<Guide>> GetGuides(string userId);

        Task<Guide> AddGuide(Guide guide);

        Task UpdateGuide(Guide guide);

        Task DeleteGuide(string userId, string guideId);
    }
}