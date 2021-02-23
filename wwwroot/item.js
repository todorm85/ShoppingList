const apiBase = '/api/items';

function createItemEl(model) {
    var createdItem = document.createElement("div");
    createdItem.innerHTML = model;
    createdItem.className = 'item';
    return createdItem;
}

function getItemElModel(item) {
    return item.innerHTML;
}

function sortItemElements(container) {
    var elements = [].slice.call(container.children);
    elements = elements.sort(function (f, s) {
        if (getItemElModel(f) > getItemElModel(s))
            return -1;
        if (getItemElModel(f) < getItemElModel(s))
            return 1;
        return 0;
    });
    for (var i = 0; i < elements.length; i++) {
        container.appendChild(elements[i]);
    }
}

function createOrUpdateItem(name, isBought) {
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
        xhr.send(name + ',' + isBought);
    });
}

function getItems() {
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
