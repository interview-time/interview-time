using System;

namespace CafApi.Common
{
    public static class TimeHelper
    {
        public static DateTime ToTimezoneTime(this DateTime originalTime, string timezone)
        {
            if (!string.IsNullOrWhiteSpace(timezone))
            {
                DateTime timezoneTime;

                TimeZoneInfo tzi = TimeZoneInfo.FindSystemTimeZoneById(timezone);

                if (originalTime.Kind != DateTimeKind.Utc)
                {
                    timezoneTime = originalTime.ToUniversalTime();
                }
                timezoneTime = TimeZoneInfo.ConvertTimeFromUtc(originalTime, tzi);

                return timezoneTime;
            }

            return originalTime;
        }
    }
}
