using ApiLenguajeDeSenas.Data;
using ApiLenguajeDeSenas.Dtos;
using ApiLenguajeDeSenas.Interfaces;
using ApiLenguajeDeSenas.Models;
using Microsoft.EntityFrameworkCore;

namespace ApiLenguajeDeSenas.Services
{
    public class DocenteService : IDocenteService
    {
        private readonly AppDbContext _context;

        public DocenteService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Docente>> GetAllAsync()
        {
            return await _context.Docentes
                .Include(d => d.Usuario)
                .ToListAsync();
        }

        public async Task<Docente?> GetByIdAsync(int id)
        {
            return await _context.Docentes
                .Include(d => d.Usuario)
                .FirstOrDefaultAsync(d => d.IdDocente == id);
        }

        public async Task<Docente> AddAsync(DocenteCreacionDto docenteDto)
        {
            // Mapeo del DTO al Modelo Docente
            var docente = new Docente
            {
                IdUsuario = docenteDto.IdUsuario,
                Especialidad = docenteDto.Especialidad,
                DNI = docenteDto.DNI,
                Telefono = docenteDto.Telefono,
                Direccion = docenteDto.Direccion,
                FechaNacimiento = docenteDto.FechaNacimiento,
                Nacionalidad = docenteDto.Nacionalidad,
                EstadoCivil = docenteDto.EstadoCivil,
                TituloDocente = docenteDto.TituloDocente,
                CvUrl = docenteDto.CvUrl,
                Activo = true
            };

            _context.Docentes.Add(docente);
            await _context.SaveChangesAsync();

            return docente;
        }

        public async Task<bool> UpdateAsync(Docente docente)
        {
            var existente = await _context.Docentes.FindAsync(docente.IdDocente);
            if (existente == null) return false;

            _context.Entry(existente).CurrentValues.SetValues(docente);
            await _context.SaveChangesAsync();
            return true;
        }


        public async Task<Docente?> GetByUserIdAsync(int idUsuario)
        {
            // Buscamos el registro Docente que tiene el IdUsuario asociado.
            // Usamos Include(d => d.Usuario) si el modelo Docente lo requiere.
            return await _context.Docentes
                .Include(d => d.Usuario)
                .FirstOrDefaultAsync(d => d.IdUsuario == idUsuario);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var docente = await _context.Docentes.FindAsync(id);
            if (docente == null) return false;

            _context.Docentes.Remove(docente);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
