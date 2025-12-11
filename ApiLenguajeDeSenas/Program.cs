using ApiLenguajeDeSenas.Data;
using ApiLenguajeDeSenas.Interfaces;
using ApiLenguajeDeSenas.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Nombre de la política CORS
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Obtener la variable de entorno de Railway
var conn = Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection");
if (string.IsNullOrEmpty(conn))
{
    throw new Exception("La variable de entorno ConnectionStrings__DefaultConnection no está definida");
}
Console.WriteLine(conn);

// Registrar DbContext solo **una vez**
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(conn));

// Servicios
builder.Services.AddScoped<IUsuarioService, UsuarioService>();
builder.Services.AddScoped<IDocenteService, DocenteService>();
builder.Services.AddScoped<IRecursoDidacticoService, RecursoDidacticoService>();
builder.Services.AddScoped<IRecuperacionService, RecuperacionService>();

// Configuración CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
       builder =>
       {
           builder.WithOrigins("https://lengua-de-senas-app.vercel.app")
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

// Middleware para capturar errores y ver logs
app.Use(async (context, next) =>
{
    try
    {
        await next();
    }
    catch (Exception ex)
    {
        context.Response.StatusCode = 500;
        await context.Response.WriteAsJsonAsync(new { error = ex.Message, stackTrace = ex.StackTrace });
    }
});

app.UseAuthorization();
app.MapControllers();

var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
app.Urls.Add($"http://*:{port}");
app.Run();
