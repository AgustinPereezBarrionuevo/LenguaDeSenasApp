using ApiLenguajeDeSenas.Data;
using ApiLenguajeDeSenas.Interfaces;
using ApiLenguajeDeSenas.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ApiLenguajeDeSenas.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecursosDidacticosController : ControllerBase
    {
        private readonly IRecursoDidacticoService _service;
        private readonly AppDbContext _context;

        public RecursosDidacticosController(IRecursoDidacticoService service, AppDbContext context)
        {
            _service = service;
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
      
            var recursos = await _service.GetAllAsync();
            return Ok(recursos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var recurso = await _service.GetByIdAsync(id);
            if (recurso == null)
                return NotFound(new { mensaje = "Recurso no encontrado" });

            return Ok(recurso);
        }

        [HttpGet("PorDocente/{idDocente}")]
        public async Task<ActionResult<IEnumerable<RecursoDidactico>>> GetRecursosPorDocente(int idDocente)
        {
            // Usa LINQ para filtrar los recursos donde el IdDocente coincide con el parámetro
            var recursos = await _context.RecursosDidacticos
                                         .Where(r => r.IdDocente == idDocente)
                                         .ToListAsync();

            // Devuelve una lista (vacía si no hay recursos), lo cual es un 200 OK.
            // Esto permite que el frontend maneje la lista vacía elegantemente.
            return Ok(recursos);
        }

        [HttpPost]
        public async Task<IActionResult> Create(RecursoDidactico recurso)
        {


            try
            {
                var nuevo = await _service.AddAsync(recurso);
                return CreatedAtAction(nameof(GetById), new { id = nuevo.IdRecurso }, nuevo);
            }
            catch (InvalidOperationException ex)
            {
                // Captura el error de ID Docente no válido
                return BadRequest(new { mensaje = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, RecursoDidactico recurso)
        {
            if (id != recurso.IdRecurso)
                return BadRequest(new { mensaje = "El ID no coincide" });

            var actualizado = await _service.UpdateAsync(recurso);
            return actualizado ? NoContent() : NotFound(new { mensaje = "Recurso no encontrado" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var eliminado = await _service.DeleteAsync(id);
            return eliminado ? NoContent() : NotFound(new { mensaje = "Recurso no encontrado" });
        }
    }
}
