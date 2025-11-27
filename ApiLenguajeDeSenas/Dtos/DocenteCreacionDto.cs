using System.ComponentModel.DataAnnotations;

namespace ApiLenguajeDeSenas.Dtos
{
    public class DocenteCreacionDto
    {
        // El IdUsuario se recibe del endpoint o del contexto del usuario autenticado
        // Pero si se crea un docente a partir de un Usuario existente, debes recibirlo.
        [Required]
        public int IdUsuario { get; set; }

        [Required, StringLength(100)]
        public required string Especialidad { get; set; }

        // --- CAMPOS NUEVOS ---

        [Required, StringLength(20)]
        public required string DNI { get; set; }

        [StringLength(15)]
        public string? Telefono { get; set; }

        [StringLength(200)]
        public string? Direccion { get; set; }

        [Required]
        public DateTime FechaNacimiento { get; set; }

        [StringLength(50)]
        public string? Nacionalidad { get; set; }

        [StringLength(30)]
        public string? EstadoCivil { get; set; }

        [Required, StringLength(200)]
        public required string TituloDocente { get; set; }

        [StringLength(255)]
        public string? CvUrl { get; set; } // URL al CV subido o referencia
    }
}
