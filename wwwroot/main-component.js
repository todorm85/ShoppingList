import '/header-component.js';

export class Main extends HTMLElement {
    constructor() {
        super();

        var titleEl = document.createElement('title');
        titleEl.innerText = 'Shopping list';

        var siteCss = document.createElement('link');
        siteCss.rel = 'stylesheet';
        siteCss.href = 'site.css'

        document.getElementsByTagName('head')[0].append(titleEl, siteCss);

        this.className = "container centered";
        var header = document.createElement('header-component');
        this.prepend(header);
    }
}

customElements.define('main-component', Main);