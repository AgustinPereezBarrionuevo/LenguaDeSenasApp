using ApiLenguajeDeSenas.Data;
using ApiLenguajeDeSenas.Interfaces;
using ApiLenguajeDeSenas.Services;
using Microsoft.EntityFrameworkCore;

namespace ApiLenguajeDeSenas
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Define el nombre de la política CORS para usarla en la aplicación
            var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

     
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("ConexionDB")));

            builder.Services.AddScoped<IUsuarioService, UsuarioService>();
            builder.Services.AddScoped<IDocenteService, DocenteService>();
            builder.Services.AddScoped<IRecursoDidacticoService, RecursoDidacticoService>();

            // CONFIGURACIÓN DE CORS ESPECÍFICA para el desarrollo local (Live Server)
            builder.Services.AddCors(options =>
            {
                options.AddPolicy(name: MyAllowSpecificOrigins,
                    builder =>
                    {
                        builder.WithOrigins(
                                "http://127.0.0.1:5500", // Live Server VS Code
                                "http://localhost:5500")
                               .AllowAnyHeader()
                               .AllowAnyMethod();
                    });
            });


    

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

     
            app.UseCors(MyAllowSpecificOrigins);

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}