using System.Threading.Tasks;

namespace CafApi.Services.Integration
{
    public interface IMergeHttpClient
    {
        Task<CreateLinkTokenResponse> CreateLinkToken(CreateLinkTokenRequest request);

        Task<RetrieveAccountTokenResponse> RetrieveAccountToken(string publicToken);
    }
}
