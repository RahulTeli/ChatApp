
using ChatApplicationNet.Hub;
using ChatApplicationNet.Model;

namespace ChatApplicationNet
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.


            // Adding SignalR Dependency
            builder.Services.AddSignalR();
            // Adding Dependency
            builder.Services.AddSingleton<IDictionary<string,UserRoomConnection>>(IServiceProvider=>new Dictionary<string,UserRoomConnection>());

            // Add CORS policy

            builder.Services.AddCors(options =>
            {
                options.AddDefaultPolicy(builder =>
                {
                    builder.WithOrigins("http://localhost:4200")
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
                });
            });

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }


            app.UseRouting();
            app.UseCors();
            app.MapHub<ChatHub>("/chat");   // -------- adding endpoint to /chat



            app.MapControllers();

            app.Run();
        }
    }
}
