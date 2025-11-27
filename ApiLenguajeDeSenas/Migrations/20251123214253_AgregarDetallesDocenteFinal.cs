using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApiLenguajeDeSenas.Migrations
{
    /// <inheritdoc />
    public partial class AgregarDetallesDocenteFinal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CvUrl",
                table: "Docentes",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DNI",
                table: "Docentes",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Direccion",
                table: "Docentes",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EstadoCivil",
                table: "Docentes",
                type: "nvarchar(30)",
                maxLength: 30,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaNacimiento",
                table: "Docentes",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Nacionalidad",
                table: "Docentes",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Telefono",
                table: "Docentes",
                type: "nvarchar(15)",
                maxLength: 15,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TituloDocente",
                table: "Docentes",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CvUrl",
                table: "Docentes");

            migrationBuilder.DropColumn(
                name: "DNI",
                table: "Docentes");

            migrationBuilder.DropColumn(
                name: "Direccion",
                table: "Docentes");

            migrationBuilder.DropColumn(
                name: "EstadoCivil",
                table: "Docentes");

            migrationBuilder.DropColumn(
                name: "FechaNacimiento",
                table: "Docentes");

            migrationBuilder.DropColumn(
                name: "Nacionalidad",
                table: "Docentes");

            migrationBuilder.DropColumn(
                name: "Telefono",
                table: "Docentes");

            migrationBuilder.DropColumn(
                name: "TituloDocente",
                table: "Docentes");
        }
    }
}
