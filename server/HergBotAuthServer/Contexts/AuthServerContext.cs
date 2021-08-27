using Microsoft.EntityFrameworkCore;
using MySql.EntityFrameworkCore;

using HergBot.AuthServer.Models;

namespace HergBot.AuthServer.Contexts
{
    public class AuthServerContext : DbContext
    {
        public DbSet<Service> Service { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseMySQL("server=localhost;database=HergBotAuthServer;user=hergbotdev;password=HBdatbitwupr8080");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Service>(entity =>
            {
                entity.HasKey(e => e.Service_Id);
            });
        }
    }
}
