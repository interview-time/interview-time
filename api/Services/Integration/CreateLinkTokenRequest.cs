using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace CafApi.Services.Integration
{
    public class CreateLinkTokenRequest
    {
        [JsonPropertyName("end_user_origin_id")]
        public string EndUserOriginId { get; set; }

        [JsonPropertyName("end_user_organization_name")]
        public string EndUserOrganizationName { get; set; }

        [JsonPropertyName("end_user_email_address")]
        public string EndUserEmailAddress { get; set; }

        [JsonPropertyName("categories")]
        public List<string> Categories { get; set; }

        [JsonPropertyName("integration")]
        public string Integration { get; set; }
    }
}
