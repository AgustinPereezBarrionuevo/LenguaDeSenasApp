using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ApiLenguajeDeSenas.Models
{
    public class Docente
    {
        [Key]
        public int IdDocente { get; set; }

        [Required]
        public int IdUsuario { get; set; }

        [ForeignKey(nameof(IdUsuario))]
        public Usuario? Usuario { get; set; }

        [Required]
        [StringLength(100)]
        public required string Especialidad { get; set; }



        [StringLength(20), Required]
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
        public string? EstadoCivil { get; set; } // Opcional

        [StringLength(200)]
        public required string TituloDocente { get; set; } // Debe ser requerido

        [StringLength(255)]
        public string? CvUrl { get; set; } // Para la URL del CV


        public bool Activo { get; set; } = true;
    }
}
