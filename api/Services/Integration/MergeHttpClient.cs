using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using static System.Net.Mime.MediaTypeNames;

namespace CafApi.Services.Integration
{
    public class MergeHttpClient : IMergeHttpClient
    {
        private readonly HttpClient _httpClient;
        private readonly string _accessToken;

        public MergeHttpClient(HttpClient httpClient, IOptions<MergeOptions> options)
        {
            _httpClient = httpClient;
            _httpClient.BaseAddress = new Uri("https://api.merge.dev/");
            _accessToken = options.Value.AccessToken;
        }

        public async Task<CreateLinkTokenResponse> CreateLinkToken(CreateLinkTokenRequest request)
        {
            var httpRequest = new HttpRequestMessage(HttpMethod.Post, "/api/integrations/create-link-token");

            httpRequest.Content = new StringContent(
                JsonSerializer.Serialize(request),
                Encoding.UTF8,
                Application.Json);

            httpRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _accessToken);

            var httpResponse = await _httpClient.SendAsync(httpRequest);
            if (httpResponse.IsSuccessStatusCode)
            {
                return await httpResponse.Content.ReadFromJsonAsync<CreateLinkTokenResponse>();
            }

            return null;
        }

        public async Task<RetrieveAccountTokenResponse> RetrieveAccountToken(string publicToken)
        {
            var httpRequest = new HttpRequestMessage(HttpMethod.Get, $"/api/integrations/account-token/{publicToken}");
            httpRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _accessToken);

            var httpResponse = await _httpClient.SendAsync(httpRequest);
            if (httpResponse.IsSuccessStatusCode)
            {
                return await httpResponse.Content.ReadFromJsonAsync<RetrieveAccountTokenResponse>();
            }

            return null;
        }
    }
}
