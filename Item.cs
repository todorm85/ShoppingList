namespace ShoppingList
{
    internal class Item
    {
        public string Name { get; set; }
        public bool IsBought { get; set; }

        public override bool Equals(object obj)
        {
            return this.Name == ((Item)obj).Name;
        }
    }
}
