namespace CafApi.ViewModel
{
    public class SetupUserRequest
    {
        public string Email { get; set; }

        public string Name { get; set; }

        public int TimezoneOffset { get; set; }

        public string Timezone { get; set; }
    }
}