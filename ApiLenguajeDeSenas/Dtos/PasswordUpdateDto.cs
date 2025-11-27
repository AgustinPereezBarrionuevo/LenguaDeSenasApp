using System.ComponentModel.DataAnnotations;

namespace ApiLenguajeDeSenas.Dtos
{
    public class PasswordUpdateDto
    {
        [Required]
        public int IdUsuario { get; set; }
        public string PasswordActual { get; set; } = string.Empty;
        public string PasswordNueva { get; set; } = string.Empty;
    }
}
