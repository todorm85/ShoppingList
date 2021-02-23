using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace ShoppingList
{
    public class Startup
    {
        private static IList<Item> items;
        private object itemsLock = new object();

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseDefaultFiles();

            app.UseStaticFiles();

            app.Use(async (context, next) =>
            {
                if (context.Request.Path.StartsWithSegments(new PathString("/api/items")))
                {
                    if (context.Request.Method == "GET")
                    {
                        await context.Response.WriteAsync(GetItems());
                    }
                    else if (context.Request.Method == "POST")
                    {
                        CreateOrUpdateItem(context.Request.Body);
                    }
                }
                else
                {
                    await next.Invoke();
                }
            });
        }

        private void CreateOrUpdateItem(Stream body)
        {
            using (var reader = new StreamReader(body))
            {
                var content = reader.ReadToEndAsync().Result;
                var contentParts = content.Split(',');
                var item = new Item()
                {
                    Name = contentParts[0],
                    IsBought = contentParts[1] == "true"
                };

                if (items.FirstOrDefault(x => x.Name == item.Name) == null)
                {
                    lock (itemsLock)
                    {
                        if (items.FirstOrDefault(x => x.Name == item.Name) == null)
                        {
                            items.Add(item);
                            Persist();
                        }
                    }
                }
                else
                {
                    lock (itemsLock)
                    {
                        var dbItem = items.FirstOrDefault(x => x.Name == item.Name);
                        if (dbItem != null)
                        {
                            dbItem.IsBought = item.IsBought;
                        }
                        else
                        {
                            // if it was deleted by another user, create it
                            items.Add(item);
                        }

                        Persist();
                    }
                }
            }
        }

        private void Persist()
        {
            var sb = new StringBuilder();
            foreach (var item in items)
            {
                sb.Append($"{item.Name}:{item.IsBought},");
            }

            File.WriteAllText("data.db", sb.ToString().TrimEnd(','));
        }

        private void LoadItemsFromPersistence()
        {
            var result = new List<Item>();
            if (File.Exists("data.db"))
            {
                var persisted = File.ReadAllText("data.db");
                var itemsParts = persisted.Split(",");
                foreach (var itemParts in itemsParts)
                {
                    result.Add(new Item()
                    {
                        Name = itemParts.Split(':')[0],
                        IsBought = itemParts.Split(':')[1] == "True"
                    });
                }
            }
            items = result;
        }

        private string GetItems()
        {
            if (items == null)
            {
                lock (itemsLock)
                {
                    if (items == null)
                    {
                        LoadItemsFromPersistence();
                    }
                }
            }

            var result = new StringBuilder("[");
            if (items.Count > 0)
            {
                foreach (var item in items)
                {
                    result.Append($"{{\"name\":\"{item.Name}\",\"isBought\":\"{item.IsBought}\"}},");
                }

                result = result.Remove(result.Length - 1, 1);
                result.Append("]");
            }
            else
            {
                result = new StringBuilder("[]");
            }

            return result.ToString();
        }
    }

    internal class Item
    {
        public string Name { get; set; }
        public bool IsBought { get; set; }
    }
}
