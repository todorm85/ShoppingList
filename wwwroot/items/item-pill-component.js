const css = `
.item {
    position: relative;
    font-family: Arial;
    display: inline-block;
    margin: 5px;
    padding: 10px;
    color: white;
    font-size: larger;
    border-radius: 10px;
    user-select: none;
    cursor: pointer;
    background-color: var(--item-background-color, lightcoral);
}

.item-loading {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    border-radius: 10px;
    z-index: 100;
    background-color: rgba(255,255,255,0.5);
}
`;

export class ItemPillComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        // to avoid FOUC inner style is used here, not loading from the external file
        var itemCss = document.createElement('style');
        itemCss.innerText = css;

        var createdItem = document.createElement("div");
        createdItem.id = 'root';
        var text = document.createElement("span");
        text.id = 'text';
        createdItem.appendChild(text);
        createdItem.className = 'item';

        this.shadowRoot.append(itemCss, createdItem);
    }

    set model(val) {
        this.shadowRoot.getElementById('text').innerHTML = val;
    }

    get model() {
        return this.shadowRoot.getElementById('text').innerHTML;
    }

    setLoading(enable) {
        if (enable) {
            let l = document.createElement('div');
            l.className = 'item-loading';
            l.onclick = function (ev) {
                ev.stopPropagation();
            }

            this.shadowRoot.getElementById('root').appendChild(l);
        } else {
            this.shadowRoot.querySelector('.item-loading').remove();
        }
    }
}

customElements.define("item-pill-component", ItemPillComponent);