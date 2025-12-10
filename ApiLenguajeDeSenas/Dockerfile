# Imagen base para ejecutar la API
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

# Imagen para compilar
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar TODO lo que está dentro de ApiLenguajeDeSenas
COPY . .

# Restaurar dependencias
RUN dotnet restore "ApiLenguajeDeSenas.csproj"

# Publicar en modo Release
RUN dotnet publish "ApiLenguajeDeSenas.csproj" -c Release -o /app/out

# Imagen final
FROM base AS final
WORKDIR /app
COPY --from=build /app/out .

ENTRYPOINT ["dotnet", "ApiLenguajeDeSenas.dll"]
