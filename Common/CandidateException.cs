using System;

namespace CafApi.Common
{
    public class CandidateException : Exception
    {
        public CandidateException()
        {
        }

        public CandidateException(string message)
            : base(message)
        {
        }

        public CandidateException(string message, Exception inner)
            : base(message, inner)
        {
        }
    }
}
