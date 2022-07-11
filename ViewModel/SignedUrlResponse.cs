using System;

namespace CafApi.ViewModel
{
    public class SignedUrlResponse
    {
        public string Url { get; set; }

        public DateTime Expires { get; set; }
    }
}