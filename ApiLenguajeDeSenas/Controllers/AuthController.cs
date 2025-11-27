using ApiLenguajeDeSenas.Data;
using Microsoft.AspNetCore.Mvc;

namespace ApiLenguajeDeSenas.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var usuario = _context.Usuarios
                .FirstOrDefault(u => u.Email == request.Email && u.Contraseña == request.Contraseña);

            if (usuario == null)
                return Unauthorized(new { mensaje = "Credenciales inválidas" });

            return Ok(new
            {
                id = usuario.IdUsuario,
                nombre = usuario.Nombre,
                email = usuario.Email,
                rol = usuario.Rol,
                fechaRegistro = usuario.FechaRegistro,
                activo = usuario.Activo,
                avatarUrl = usuario.AvatarUrl // ← ACA VA
            });
        }
    }

    public class LoginRequest
    {
        public required string Email { get; set; }
        public required string Contraseña { get; set; }
    }
}
