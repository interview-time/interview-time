using System.Text.Json.Serialization;

namespace CafApi.Services.Integration
{
    public class CreateLinkTokenResponse
    {
        [JsonPropertyName("link_token")]
        public string LinkToken { get; set; }

        [JsonPropertyName("integration_name")]
        public string IntegrationName { get; set; }
    }
}
