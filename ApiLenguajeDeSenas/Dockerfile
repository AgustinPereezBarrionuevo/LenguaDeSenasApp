# Etapa 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiamos todo el proyecto al contenedor
COPY . .

# Publicamos la app en modo Release en /app/out
RUN dotnet publish -c Release -o /app/out

# Etapa 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copiamos desde la etapa de build
COPY --from=build /app/out .

# Exponemos el puerto que Railway usará
EXPOSE 10000

# Comando para iniciar la app
ENTRYPOINT ["dotnet", "ApiLenguajeDeSenas.dll", "--urls", "http://0.0.0.0:10000"]
