using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ApiLenguajeDeSenas.Models
{
    public class RecuperacionClave
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int IdUsuario { get; set; }

        [ForeignKey(nameof(IdUsuario))]
        public Usuario? Usuario { get; set; }

        [Required]
        public int Codigo { get; set; }

        [Required]
        public DateTime FechaGeneracion { get; set; } = DateTime.Now;

        [Required]
        public bool Usado { get; set; } = false;
    }
}
