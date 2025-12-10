using ApiLenguajeDeSenas.Dtos;
using System.Threading.Tasks;

public interface IRecuperacionService
{
    Task<bool> EnviarCodigoAsync(string email);
    Task<bool> RestablecerContrasenaAsync(RestablecerContrasenaRequest request);
}
