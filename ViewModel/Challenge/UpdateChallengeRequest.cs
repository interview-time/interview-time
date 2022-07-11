namespace CafApi.ViewModel
{
    public class UpdateChallengeRequest
    {
        public string Name { get; set; }

        public int Order { get; set; }

        public string FileName { get; set; }

        public string GitHubUrl { get; set; }
    }
}
