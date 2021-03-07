import * as service from './items/item-service.js'

var itemsToAdd = document.getElementById("itemsToAdd");
var itemsToBuy = document.getElementById("itemsToBuy");
var itemsBought = document.getElementById("itemsBought");
var addItemInput = document.getElementById("addItemInput");
var allitems = [];
var isLoading = 0;

function createClickableItemElement(text, isBought) {
    var createdItem = service.createItemEl(text);
    createdItem.onclick = function () { onItemClick(this, !isBought) };
    var container = isBought ? itemsBought : itemsToBuy;
    container.prepend(createdItem);
}

function onItemClick(item, isBought) {
    var text = item.model;
    item.setLoading(true);
    isLoading++;
    service.createOrUpdateItem(text, isBought).then(function (res) {
        item.remove();
        createClickableItemElement(text, isBought);
    }).finally(function () {
        item.setLoading(false);
        isLoading--;
    });
}

addItemInput.oninput = function (ev) {
    var currentInput = ev.target.value.trim();
    itemsToAdd.innerHTML = "";
    if (!currentInput) {
        itemsToAdd.style.display = 'none';
        return
    }

    itemsToAdd.style.display = 'block';
    var allInputs = [currentInput];
    for (var i = 0; i < allitems.length; i++) {
        if (allitems[i].name.startsWith(currentInput) && allitems[i].name !== currentInput) {
            allInputs.push(allitems[i].name);
        }
    }

    for (var i = 0; i < allInputs.length; i++) {
        var newItem = service.createItemEl(allInputs[i]);
        newItem.onclick = function (ev) {
            var item = this;
            var tergetText = item.model;
            addNewItem(tergetText);
        }

        itemsToAdd.appendChild(newItem);
    }
}

addItemInput.onkeyup = function (e) {
    var currentInput = e.target.value;
    if (e.isComposing || e.keyCode === 229)
        return;
    e.stopPropagation();
    if (e.keyCode === 13) {
        addNewItem(currentInput);
    }
}

function addNewItem(name) {
    isLoading++;
    service.createOrUpdateItem(name, false).then(function (result) {
        Array.from(document.getElementsByTagName("item-component")).forEach(function (x) {
            if (x.model == name) {
                x.remove();
            }
        });

        createClickableItemElement(name, false);
        itemsToAdd.innerHTML = '';
        addItemInput.value = '';
        itemsToAdd.style.display = 'none';
    }).finally(function () {
        isLoading--;
    });
}

function refreshItems() {
    if (isLoading > 0) {
        setTimeout(function () {
            refreshItems();
        }, 5000);

        return;
    }

    service.getItems().then(function (items) {
        if (!items || items && items.length === 0) {
            return;
        }

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var newContainer;
            var oldContainer;
            if (item.isBought === 'True') {
                newContainer = itemsBought;
                oldContainer = itemsToBuy;
            } else {
                newContainer = itemsToBuy;
                oldContainer = itemsBought;
            }

            if (!(service.hasItemElement(newContainer, item.name))) {
                createClickableItemElement(item.name, item.isBought === 'True');
            }

            var previousNode = service.getItemElement(oldContainer, item.name);
            if (previousNode) {
                previousNode.remove();
            }
        }

        allitems = items;
    }).finally(function () {
        setTimeout(function () {
            refreshItems();
        }, 5000);
    });
}

refreshItems();