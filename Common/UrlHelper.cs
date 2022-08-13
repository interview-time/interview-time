namespace CafApi.Common
{
    public static class UrlHelper
    {
        public static string GetDownloadChallengekPath(string token)
        {
            return $"/challenge/{token}/download";
        }

        public static string GetChallengePageUrl(string host, string token)
        {
            return $"{host}/challenge/{token}";
        }

        public static string GetInterviewPageUrl(string host, string interviewId, string teamId)
        {
            return $"{host}/interviews/scorecard/{interviewId}?teamId={teamId}";
        }
    }
}
