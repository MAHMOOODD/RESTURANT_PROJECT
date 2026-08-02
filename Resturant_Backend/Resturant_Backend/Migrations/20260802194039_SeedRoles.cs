using Microsoft.EntityFrameworkCore.Migrations;
using Resturant_Backend.Roles;

#nullable disable

namespace Resturant_Backend.Migrations
{
    /// <inheritdoc />
    public partial class SeedRoles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
           table: "AspNetRoles",
           columns: new[] { "Id", "Name", "NormalizedName", "ConcurrencyStamp" },
           values: new object[,]
           {
                { "1",Role.Admin ,Role.Admin.ToUpper() , Guid.NewGuid().ToString() },
                { "2",Role.Manager ,Role.Manager.ToUpper() , Guid.NewGuid().ToString() },
                { "3",Role.User ,Role.User.ToUpper() , Guid.NewGuid().ToString() }
           });

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
            table: "AspNetRoles",
            keyColumn: "Id",
            keyValue: "1");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "2");
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "3");

        }
    }
}
