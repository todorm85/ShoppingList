import './item-pill-component.js';

const apiBase = '/api/items';

export function createItemEl(model) {
    var el = document.createElement('item-pill-component');
    el.model = model;
    return el;
}

export function sortItemElements(container) {
    var elements = [].slice.call(container.children);
    elements = elements.sort(function (f, s) {
        if (f.model > s.model)
            return -1;
        if (f.model < s.model)
            return 1;
        return 0;
    });
    for (var i = 0; i < elements.length; i++) {
        container.appendChild(elements[i]);
    }
}

export function createOrUpdateItem(name, isBought) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function (ev) {
            let httpRequest = ev.target;
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === 200) {
                    resolve(httpRequest.responseText);
                } else {
                    reject('There was a problem with the request.');
                }
            }
        };

        xhr.open('POST', apiBase);
        xhr.setRequestHeader('content-type', 'application/json');
        xhr.send(JSON.stringify({ name, isBought }));
    });
}

export function getItems() {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function (ev) {
            let httpRequest = ev.target;
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === 200) {
                    resolve(JSON.parse(httpRequest.responseText));
                } else {
                    reject('There was a problem with the request.');
                }
            }
        };

        xhr.open('GET', apiBase);
        xhr.send();
    });
}

export function hasItemElement(container, itemName) {
    return !!getItemElement(container, itemName)
}

export function getItemElement(container, itemName) {
    var item;
    container.childNodes.forEach(function (n) {
        if (n.model === itemName) {
            item = n;
        }
    });

    return item;
}

export function deleteItem(name) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function (ev) {
            let httpRequest = ev.target;
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === 200) {
                    resolve(httpRequest.responseText);
                } else {
                    reject('There was a problem with the request.');
                }
            }
        };

        xhr.open('DELETE', apiBase);
        xhr.setRequestHeader('content-type', 'application/json');
        xhr.send(JSON.stringify({ name }));
    });
}