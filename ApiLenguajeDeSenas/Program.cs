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

            // Nombre de la política CORS
            var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // Conexión a Azure SQL vía variable de entorno
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection")));


            // Servicios
            builder.Services.AddScoped<IUsuarioService, UsuarioService>();
            builder.Services.AddScoped<IDocenteService, DocenteService>();
            builder.Services.AddScoped<IRecursoDidacticoService, RecursoDidacticoService>();
            builder.Services.AddScoped<IRecuperacionService, RecuperacionService>();

            // CORS: localhost para pruebas + frontend en producción
            builder.Services.AddCors(options =>
            {
                options.AddPolicy(name: MyAllowSpecificOrigins,
                   builder =>
                    {
                         builder.AllowAnyOrigin()   // <--- permite cualquier origen
                        .AllowAnyHeader()
                         .AllowAnyMethod();
                    });
            });

            var app = builder.Build();

            // Swagger
            app.UseSwagger();
            app.UseSwaggerUI();

            app.UseHttpsRedirection();

            app.UseCors(MyAllowSpecificOrigins);

            app.UseAuthorization();

            app.MapControllers();

            var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
            app.Urls.Add($"http://*:{port}");
            app.Run();
        }
    }
}
