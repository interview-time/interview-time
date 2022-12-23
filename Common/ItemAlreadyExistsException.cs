using System;

namespace CafApi.Common
{
    public class ItemAlreadyExistsException : Exception
    {
        public ItemAlreadyExistsException()
        {
        }

        public ItemAlreadyExistsException(string message)
            : base(message)
        {
        }

        public ItemAlreadyExistsException(string message, Exception inner)
            : base(message, inner)
        {
        }
    }
}
