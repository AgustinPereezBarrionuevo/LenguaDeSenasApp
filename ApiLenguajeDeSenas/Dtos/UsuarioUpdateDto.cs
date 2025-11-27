using System.ComponentModel.DataAnnotations;

namespace ApiLenguajeDeSenas.Dtos
{
    public class UsuarioUpdateDto
    {
        [Required]
        public int IdUsuario { get; set; }

        [Required]
        public string Nombre { get; set; } = string.Empty;

        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        public string? AvatarUrl { get; set; }
    }
}
