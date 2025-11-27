using ApiLenguajeDeSenas.Dtos;
using ApiLenguajeDeSenas.Models;

namespace ApiLenguajeDeSenas.Interfaces
{
    public interface IDocenteService
    {
        Task<IEnumerable<Docente>> GetAllAsync();
        Task<Docente?> GetByIdAsync(int id);
        Task<Docente> AddAsync(DocenteCreacionDto docenteDto);
        Task<bool> UpdateAsync(Docente docente);
        Task<bool> DeleteAsync(int id);
        Task<Docente?> GetByUserIdAsync(int idUsuario);
    }
}
