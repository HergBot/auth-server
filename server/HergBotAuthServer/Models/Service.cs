using System;

namespace HergBot.AuthServer.Models
{
    public class Service
    {
        public int? Service_Id { get; set; }

        public string Name { get; set; }

        public DateTime Created { get; set; }

        public DateTime? Deactivated { get; set; }
    }
}
