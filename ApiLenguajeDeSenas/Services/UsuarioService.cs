using ApiLenguajeDeSenas.Data;
using ApiLenguajeDeSenas.Interfaces;
using ApiLenguajeDeSenas.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace ApiLenguajeDeSenas.Services
{
    public class UsuarioService : IUsuarioService
    {
        private readonly AppDbContext _context;

        public UsuarioService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Usuario>> GetAllAsync()
        {
            return await _context.Usuarios.ToListAsync();
        }

        public async Task<Usuario?> GetByIdAsync(int id)
        {
            return await _context.Usuarios.FindAsync(id);
        }

        public async Task<Usuario> AddAsync(Usuario usuario)
        {

            var existe = await _context.Usuarios
            .AnyAsync(u => u.Email == usuario.Email);
            if (existe)
            {
                throw new InvalidOperationException($"El email '{usuario.Email}' ya está registrado. Debe ser único.");
            }
            usuario.Email = usuario.Email.ToLower();

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();
            return usuario;
        }

        public async Task<bool> UpdateAsync(Usuario usuarioActualizado)
        {
            var existente = await _context.Usuarios
                                            .FirstOrDefaultAsync(u => u.IdUsuario == usuarioActualizado.IdUsuario);

            if (existente == null) return false;

    
            _context.Usuarios.Attach(existente);

   

            existente.Nombre = usuarioActualizado.Nombre;
            existente.Email = usuarioActualizado.Email;
            existente.AvatarUrl = usuarioActualizado.AvatarUrl;
     

   
            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (DbUpdateConcurrencyException)
            {
          
                return false;
            }
        }

        public async Task<bool> UpdatePasswordAsync(Usuario usuarioActualizado)
        {
            var existente = await _context.Usuarios
                        .FirstOrDefaultAsync(u => u.IdUsuario == usuarioActualizado.IdUsuario);

            if (existente == null)
                return false;

            existente.Contraseña = usuarioActualizado.Contraseña;

            await _context.SaveChangesAsync();
            return true;
        }


        public async Task<bool> DeleteAsync(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null) return false;

            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
