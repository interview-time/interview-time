using System.Threading.Tasks;

namespace CafApi.Services
{
    public interface ICandidateService
    {
        Task<string> GetUploadSignedUrl(string userId, string teamId, string candidateId, string filename);
    }
}
