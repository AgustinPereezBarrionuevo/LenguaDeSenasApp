using ApiLenguajeDeSenas.Models;

namespace ApiLenguajeDeSenas.Interfaces
{
    public interface IRecursoDidacticoService
    {
        Task<IEnumerable<object>> GetAllAsync();
        Task<RecursoDidactico?> GetByIdAsync(int id);
        Task<RecursoDidactico> AddAsync(RecursoDidactico recurso);
        Task<bool> UpdateAsync(RecursoDidactico recurso);
        Task<bool> DeleteAsync(int id);
    }
}
