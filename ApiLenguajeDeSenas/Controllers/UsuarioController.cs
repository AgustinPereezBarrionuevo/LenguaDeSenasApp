using ApiLenguajeDeSenas.Dtos;
using ApiLenguajeDeSenas.Interfaces;
using ApiLenguajeDeSenas.Models;
using Microsoft.AspNetCore.Mvc;

namespace ApiLenguaSenas.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuariosController : ControllerBase
    {
        private readonly IUsuarioService _usuarioService;

        public UsuariosController(IUsuarioService usuarioService)
        {
            _usuarioService = usuarioService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var usuarios = await _usuarioService.GetAllAsync();
            return Ok(usuarios);
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] Usuario usuario)
        {
            var nuevo = await _usuarioService.AddAsync(usuario);
            return CreatedAtAction(nameof(GetAll), new { id = nuevo.IdUsuario }, nuevo);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UsuarioUpdateDto dto)
        {
            if (id != dto.IdUsuario)
                return BadRequest("ID no coincide");

            var usuario = await _usuarioService.GetByIdAsync(dto.IdUsuario);
            if (usuario == null)
                return NotFound();

            usuario.Nombre = dto.Nombre;
            usuario.Email = dto.Email;
            usuario.AvatarUrl = dto.AvatarUrl;

            var actualizado = await _usuarioService.UpdateAsync(usuario);

            return actualizado ? NoContent() : NotFound();
        }

        [HttpPost("CambiarPassword")]
        public async Task<IActionResult> CambiarPassword([FromBody] PasswordUpdateDto dto)
        {
            var usuario = await _usuarioService.GetByIdAsync(dto.IdUsuario);
            if (usuario == null)
                return NotFound("Usuario no encontrado");

            if (usuario.Contraseña != dto.PasswordActual)
                return BadRequest("La contraseña actual no es correcta");

            usuario.Contraseña = dto.PasswordNueva;
            var actualizado = await _usuarioService.UpdatePasswordAsync(usuario);

            return actualizado ? Ok("Contraseña actualizada") : BadRequest("Error al actualizar");
        }



        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var eliminado = await _usuarioService.DeleteAsync(id);
            return eliminado ? NoContent() : NotFound();
        }
    }
}
