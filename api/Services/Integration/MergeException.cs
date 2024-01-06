using System;

namespace CafApi.Services.Integration
{
    public class MergeException : Exception
    {
        public MergeException()
        {
        }

        public MergeException(string message)
            : base(message)
        {
        }

        public MergeException(string message, Exception inner)
            : base(message, inner)
        {
        }
    }
}
