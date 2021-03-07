using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace ShoppingList
{
    internal class ItemsRepo
    {
        private static IList<Item> items = new List<Item>();
        private static object itemsLock = new object();

        static ItemsRepo()
        {
            // items are read only once from persistence, then an in memory object is used
            LoadItemsFromPersistence();
        }

        public void CreateOrUpdateItem(Item item)
        {
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

        public IEnumerable<Item> GetItems()
        {
            return items;
        }

        private static void LoadItemsFromPersistence()
        {
            if (File.Exists("data.db"))
            {
                var persisted = File.ReadAllText("data.db");
                items = persisted.DeserializeItems().ToList();
            }
        }

        internal void Delete(Item item)
        {
            if (items.FirstOrDefault(x => x.Name == item.Name) != null)
            {
                lock (itemsLock)
                {
                    if (items.FirstOrDefault(x => x.Name == item.Name) != null)
                    {
                        items.Remove(item);
                        Persist();
                    }
                }
            }
        }

        private void Persist()
        {
            File.WriteAllText("data.db", items.Serialize());
        }
    }
}
