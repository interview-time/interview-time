using System;
using System.Linq;

namespace CafApi.Utils
{
    public static class StringHelper
    {
        public static string GenerateToken()
        {
            char[] padding = { '=' };

            byte[] time = BitConverter.GetBytes(DateTime.UtcNow.ToBinary());
            byte[] key = Guid.NewGuid().ToByteArray();
            string token = Convert.ToBase64String(time.Concat(key).ToArray());

            token = token.TrimEnd(padding).Replace('+', '-').Replace('/', '_');

            return token;
        }
    }
}