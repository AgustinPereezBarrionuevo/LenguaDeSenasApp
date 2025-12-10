# Imagen base para compilar
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar csproj y restaurar dependencias
COPY ApiLenguajeDeSenas/ApiLenguajeDeSenas.csproj ApiLenguajeDeSenas/
RUN dotnet restore ApiLenguajeDeSenas/ApiLenguajeDeSenas.csproj

# Copiar todo el código
COPY ApiLenguajeDeSenas/ ApiLenguajeDeSenas/
WORKDIR /src/ApiLenguajeDeSenas

# Publicar en modo release
RUN dotnet publish -c Release -o /app/out

# Imagen runtime (lo que se ejecuta)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/out .

ENTRYPOINT ["dotnet", "ApiLenguajeDeSenas.dll"]
