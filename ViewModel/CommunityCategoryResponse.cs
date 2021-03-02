using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CafApi.ViewModel
{
    public class CommunityCategoryResponse
    {
        public string Id { get; set; }
        
        public string Name { get; set; }

        public string Image { get; set; }
    }
}