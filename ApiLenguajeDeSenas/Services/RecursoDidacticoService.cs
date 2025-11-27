using ApiLenguajeDeSenas.Data;
using ApiLenguajeDeSenas.Interfaces;
using ApiLenguajeDeSenas.Models;
using Microsoft.EntityFrameworkCore;

namespace ApiLenguajeDeSenas.Services
{
    public class RecursoDidacticoService : IRecursoDidacticoService
    {
        private readonly AppDbContext _context;

        public RecursoDidacticoService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<object>> GetAllAsync()
        {
            // Usamos Select para proyectar a un objeto que incluya el nombre del docente.
            return await _context.RecursosDidacticos
                .Include(r => r.Docente)
                .ThenInclude(d => d.Usuario)
                .Select(r => new
                {
                    r.IdRecurso,
                    r.Titulo,
                    r.Descripcion,
                    r.UrlRecurso,
                    r.FechaPublicacion,
                    docente = new
                    {
                        usuario = new
                        {
                            email = r.Docente!.Usuario!.Email
                        }
                    }
                })
                .ToListAsync();
        }

        public async Task<RecursoDidactico?> GetByIdAsync(int id)
        {
            return await _context.RecursosDidacticos
                .Include(r => r.Docente)
                .ThenInclude(d => d.Usuario)
                .FirstOrDefaultAsync(r => r.IdRecurso == id);
        }

        public async Task<RecursoDidactico> AddAsync(RecursoDidactico recurso)
        {
            // 1. VALIDACIÓN: Asegurar que el IdDocente existe
            var docenteExiste = await _context.Docentes
                .AnyAsync(d => d.IdDocente == recurso.IdDocente);

            if (!docenteExiste)
            {
                throw new InvalidOperationException($"El Docente con ID {recurso.IdDocente} no existe.");
            }

            _context.RecursosDidacticos.Add(recurso);
            await _context.SaveChangesAsync();
            return recurso;
        }

        public async Task<bool> UpdateAsync(RecursoDidactico recurso)
        {
            var existente = await _context.RecursosDidacticos.FindAsync(recurso.IdRecurso);
            if (existente == null) return false;

            _context.Entry(existente).CurrentValues.SetValues(recurso);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var recurso = await _context.RecursosDidacticos.FindAsync(id);
            if (recurso == null) return false;

            _context.RecursosDidacticos.Remove(recurso);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
