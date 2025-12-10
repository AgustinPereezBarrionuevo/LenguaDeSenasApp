namespace ApiLenguajeDeSenas.Dtos
{
    public class RestablecerContrasenaRequest
    {
        public string Email { get; set; } = string.Empty;
        public int Codigo { get; set; }
        public string NuevaContrasena { get; set; } = string.Empty;
    }
}
