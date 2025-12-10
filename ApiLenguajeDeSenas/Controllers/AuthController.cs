using ApiLenguajeDeSenas.Data;
using ApiLenguajeDeSenas.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace ApiLenguajeDeSenas.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IRecuperacionService _recService;


        public AuthController(AppDbContext context, IRecuperacionService recService)
        {

            _context = context;
            _recService = recService;

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

        [HttpPost("recuperar")]
        public async Task<IActionResult> Recuperar([FromBody] RecuperarContrasenaRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email))
                return BadRequest("Email requerido");

            var enviado = await _recService.EnviarCodigoAsync(request.Email);
            if (!enviado) return NotFound(new { mensaje = "Email no registrado" });

            return Ok(new { mensaje = "Código enviado a tu correo" });
        }

        [HttpPost("restablecer")]
        public async Task<IActionResult> Restablecer([FromBody] RestablecerContrasenaRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.NuevaContrasena))
                return BadRequest("Datos incompletos");

            var exito = await _recService.RestablecerContrasenaAsync(request);
            if (!exito) return BadRequest(new { mensaje = "No se pudo restablecer la contraseña (código inválido o expirado)" });

            return Ok(new { mensaje = "Contraseña restablecida correctamente" });
        }
    }



    public class LoginRequest
    {
        public required string Email { get; set; }
        public required string Contraseña { get; set; }
    }
}
