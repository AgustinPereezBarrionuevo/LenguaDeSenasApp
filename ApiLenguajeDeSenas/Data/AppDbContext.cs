using ApiLenguajeDeSenas.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace ApiLenguajeDeSenas.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Docente> Docentes { get; set; }
        public DbSet<RecursoDidactico> RecursosDidacticos { get; set; }
    }

}
