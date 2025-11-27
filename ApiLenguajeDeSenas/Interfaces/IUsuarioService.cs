using ApiLenguajeDeSenas.Models;

namespace ApiLenguajeDeSenas.Interfaces
{
    public interface IUsuarioService
    {
        Task<IEnumerable<Usuario>> GetAllAsync();
        Task<Usuario?> GetByIdAsync(int id);
        Task<Usuario> AddAsync(Usuario usuario);
        Task<bool> UpdateAsync(Usuario usuario);
        Task<bool> UpdatePasswordAsync(Usuario usuario);
        Task<bool> DeleteAsync(int id);
    }
}
