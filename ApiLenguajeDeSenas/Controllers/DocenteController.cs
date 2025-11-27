using ApiLenguajeDeSenas.Data;
using ApiLenguajeDeSenas.Dtos;
using ApiLenguajeDeSenas.Interfaces;
using ApiLenguajeDeSenas.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace ApiLenguajeDeSenas.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DocentesController : ControllerBase
    {
        private readonly IDocenteService _service;
        private readonly AppDbContext _context;

        public DocentesController(IDocenteService service, AppDbContext context)
        {
            _service = service;
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var docentes = await _service.GetAllAsync();
            return Ok(docentes);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var docente = await _service.GetByIdAsync(id);
            if (docente == null)
                return NotFound(new { mensaje = "Docente no encontrado" });

            return Ok(docente);
        }

        [HttpPost]
        public async Task<IActionResult> Create(DocenteCreacionDto docenteDto)
        {
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.IdUsuario == docenteDto.IdUsuario);

            if (usuario == null)
                return BadRequest(new { mensaje = "El usuario no existe" });

            // 💡 Llama al servicio que ya hace el mapeo y guarda
            var nuevoDocente = await _service.AddAsync(docenteDto);

            // Actualizar el rol del Usuario
            usuario.Rol = "Docente";
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = nuevoDocente.IdDocente }, nuevoDocente);
        }


        [HttpGet("PorUsuario/{idUsuario}")] // Ruta nueva y específica
        public async Task<IActionResult> GetByUserId(int idUsuario)
        {
            var docente = await _service.GetByUserIdAsync(idUsuario);

            if (docente == null)
                return NotFound(new { mensaje = "El usuario no está registrado como Docente activo." });

            // Retornamos el objeto Docente. El frontend usará docente.idDocente.
            return Ok(docente);
        }


       

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            // 1. Buscar el Docente para obtener su IdUsuario
            var docente = await _context.Docentes
                .FirstOrDefaultAsync(d => d.IdDocente == id);

            if (docente == null)
                return NotFound(new { mensaje = "Docente no encontrado" });

            // Guardamos el IdUsuario asociado
            int idUsuarioAsociado = docente.IdUsuario;

            // 2. Eliminar el registro del Docente (quitar el rol)
            _context.Docentes.Remove(docente);

            // 3. Buscar el Usuario principal y actualizar su Rol a 'Alumno'
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.IdUsuario == idUsuarioAsociado);

            if (usuario != null)
            {
                usuario.Rol = "Alumno"; // Degradación del rol
            }

            // 4. Guardar los cambios (elimina Docente y actualiza Rol de Usuario)
            await _context.SaveChangesAsync();

            return NoContent(); // Retorna el código 204
        }
    }
}

