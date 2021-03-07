export class Header extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });

        let header = document.createElement("header");

        header.innerHTML = `
<nav>
    <ul>
        <li><a href="index.html">Shopping List</a></li>
        <li><a href="manager.html">Item Manager</a></li>
    </ul>
</nav>
`;

        let noscript = document.createElement('noscript');
        noscript.innerText = 'BROWSER MUST SUPPORT JAVASCRIPT!';

        const linkElem = document.createElement('link');
        linkElem.setAttribute('rel', 'stylesheet');
        linkElem.setAttribute('href', 'header-component.css');

        this.shadowRoot.append(linkElem, noscript, header);

        if (false) {
            const watchSim = document.createElement('script');
            watchSim.setAttribute('src', 'watch-sim.js');
            this.shadowRoot.append(watchSim);
        }
    }

}

customElements.define('header-component', Header);