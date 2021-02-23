using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ShoppingList
{
    public static class ItemsExtensions
    {
        internal static string Serialize(this Item item)
        {
            return $"{{\"name\":\"{item.Name}\",\"isBought\":\"{item.IsBought}\"}}";
        }

        internal static string Serialize(this IEnumerable<Item> items)
        {
            var result = new StringBuilder("[");
            if (items.Count() > 0)
            {
                foreach (var item in items)
                {
                    result.Append(item.Serialize() + ",");
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

        internal static IEnumerable<Item> DeserializeItems(this string items)
        {
            var result = new List<Item>();
            items = items.Trim('[').Trim(']');
            var itemParts = items.Split("},{");
            foreach (var itemPart in itemParts)
            {
                result.Add($"{{{itemPart.Trim('{').Trim('}')}}}".DeserializeItem());
            }

            return result;
        }

        internal static Item DeserializeItem(this string item)
        {
            return new Item()
            {
                Name = GetValue("name", item),
                IsBought = GetValue("isBought", item)?.ToLower() == "true"
            };            
        }

        private static string GetValue(string propName, string item)
        {
            var itemParts = item.Split($"\"{propName}\":");
            if (itemParts.Length > 1)
            {
                return itemParts[1].Split(',')[0].Trim('}').Trim('\"');
            }
            else
            {
                return null;
            }
        }
    }
}
