using System.IO;
using System.Threading;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace ShoppingList
{
    public class Startup
    {
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseDefaultFiles();

            app.UseStaticFiles();

            app.UseItemsApiEndpoint();
        }

    }

    internal static class AppBuilderExtensions
    {
        private static ItemsRepo service = new ItemsRepo();
        private const string ItemsServicePath = "/api/items";

        internal static IApplicationBuilder UseItemsApiEndpoint(this IApplicationBuilder app)
        {
            return app.Use(async (context, next) =>
            {
                if (context.Request.Path.StartsWithSegments(new PathString(ItemsServicePath)))
                {
                    if (context.Request.Method == "GET")
                    {
                        await context.Response.WriteAsync(service.GetItems().Serialize());
                    }
                    else if (context.Request.Method == "POST")
                    {
                        using (var reader = new StreamReader(context.Request.Body))
                        {
                            var content = await reader.ReadToEndAsync();
                            service.CreateOrUpdateItem(content.DeserializeItem());
                        }
                    }
                    else if (context.Request.Method == "DELETE")
                    {
                        using (var reader = new StreamReader(context.Request.Body))
                        {
                            var content = await reader.ReadToEndAsync();
                            service.Delete(content.DeserializeItem());
                        }
                    }
                }
            });
        }
    }
}
