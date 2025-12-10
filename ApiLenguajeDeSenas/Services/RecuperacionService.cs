using ApiLenguajeDeSenas.Data;
using ApiLenguajeDeSenas.Dtos;
using System.Net.Mail;
using System.Net;
using Microsoft.EntityFrameworkCore;
using ApiLenguajeDeSenas.Models;


public class RecuperacionService : IRecuperacionService
{
    private readonly AppDbContext _context;
    private readonly string _correoOrigen = "proyecto.puente.lsa@gmail.com"; // tu Gmail
    private readonly string _passwordApp = "veicdtqdvxvmxsrh";        // contraseña de aplicación

    public RecuperacionService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> EnviarCodigoAsync(string email)
    {
        var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == email);
        if (usuario == null) return false;

        var codigo = new Random().Next(100000, 999999);

        var rec = new RecuperacionClave
        {
            IdUsuario = usuario.IdUsuario,
            Codigo = codigo
        };

        _context.RecuperacionClaves.Add(rec);
        await _context.SaveChangesAsync();

        using var client = new SmtpClient("smtp.gmail.com", 587)
        {
            Credentials = new NetworkCredential(_correoOrigen, _passwordApp),
            EnableSsl = true
        };

        var mensaje = new MailMessage(_correoOrigen, email)
        {
                        Subject = "🔐 Recuperación de contraseña - Plataforma Educativa",
                        Body = $@"
                <div style='font-family: Arial, Helvetica, sans-serif; background: #f5f5f5; padding: 20px;'>
                    <div style='max-width: 500px; margin: auto; background: #ffffff; border-radius: 10px; padding: 25px; box-shadow: 0 3px 10px rgba(0,0,0,0.1);'>

                        <h2 style='color:#0a3d62; text-align:center; margin-top:0;'>Recuperación de contraseña</h2>

                        <p style='font-size:16px; color:#333;'>
                            Hola 👋, recibimos una solicitud para recuperar la contraseña de tu cuenta.
                        </p>

                        <p style='font-size:16px; color:#333;'>
                            Tu código de verificación es:
                        </p>

                        <div style='text-align:center; margin: 25px 0;'>
                            <span style='display:inline-block; font-size:32px; 
                                          background:#82ccdd; color:#0a3d62; 
                                          padding:12px 25px; border-radius:8px;
                                          letter-spacing:3px; font-weight:bold;'>
                                {codigo}
                            </span>
                        </div>

                        <p style='font-size:14px; color:#555;'>
                            Este código es válido por 10 minutos.  
                            Si no solicitaste este cambio, simplemente ignorá este mensaje.
                        </p>

                        <p style='text-align:center; margin-top:30px; font-size:13px; color:#aaa;'>
                            Plataforma Educativa LSA © 2025
                        </p>
                    </div>
                </div>",
            IsBodyHtml = true
        };


        client.Send(mensaje);

        return true;
    }

    public async Task<bool> RestablecerContrasenaAsync(RestablecerContrasenaRequest request)
    {
        var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (usuario == null) return false;

        var rec = await _context.RecuperacionClaves
            .Where(r => r.IdUsuario == usuario.IdUsuario && !r.Usado)
            .OrderByDescending(r => r.FechaGeneracion)
            .FirstOrDefaultAsync();

        if (rec == null) return false;
        if ((DateTime.Now - rec.FechaGeneracion).TotalMinutes > 10) return false;
        if (rec.Codigo != request.Codigo) return false;

        usuario.Contraseña = request.NuevaContrasena;
        rec.Usado = true;

        await _context.SaveChangesAsync();
        return true;
    }
}