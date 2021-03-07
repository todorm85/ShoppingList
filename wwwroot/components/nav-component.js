export class NavComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        var itemCss = document.createElement('link');
        itemCss.rel = 'stylesheet';
        itemCss.href = import.meta.url.replace(".js", ".css");

        var createdItem = document.createElement("nav");
        createdItem.innerHTML = `
    <ul>
        <li><a href="index.html">Shopping List</a></li>
        <li><a href="manager.html">Item Manager</a></li>
    </ul>
`;

        this.shadowRoot.append(itemCss, createdItem);
    }
}

customElements.define("nav-component", NavComponent);