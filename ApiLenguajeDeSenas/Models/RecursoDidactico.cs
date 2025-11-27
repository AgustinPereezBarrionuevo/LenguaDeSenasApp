using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ApiLenguajeDeSenas.Models
{
    public class RecursoDidactico
    {
        [Key]
        public int IdRecurso { get; set; }

        [Required]
        [StringLength(150)]
        public required string Titulo { get; set; }

        [StringLength(300)]
        public required string Descripcion { get; set; }

        [StringLength(250)]
        public required string UrlRecurso { get; set; }

        [Required]
        public int IdDocente { get; set; }

        [ForeignKey(nameof(IdDocente))]
        public Docente? Docente { get; set; }

        public DateTime FechaPublicacion { get; set; } = DateTime.Now;
    }
}
