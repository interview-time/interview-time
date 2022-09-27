using System.Text.Json.Serialization;

namespace CafApi.Services.Integration
{
    public class RetrieveAccountTokenResponse
    {
        [JsonPropertyName("account_token")]
        public string AccountToken { get; set; }
    }
}
