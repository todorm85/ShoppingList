var itemsToAdd = document.getElementById("itemsToAdd");
var itemsToBuy = document.getElementById("itemsToBuy");
var itemsBought = document.getElementById("itemsBought");
var addItemInput = document.getElementById("addItemInput");
var allitems;

function createItemToBuyEl(text) {
    var createdItem = createItemEl(text);
    createdItem.onclick = function (ev) {
        var item = ev.target;
        var text = getItemElModel(item);
        createOrUpdateItem(text, true).then(function (res) {
            item.remove();
            createBoughtItemEl(text);
        });
    }

    itemsToBuy.appendChild(createdItem);
    sortItemElements(itemsToBuy);
}

function createBoughtItemEl(text) {
    var createdItem = createItemEl(text);
    createdItem.onclick = function (ev) {
        var item = ev.target;
        var text = getItemElModel(item);
        createOrUpdateItem(text, false).then(function (result) {
            item.remove();
            createItemToBuyEl(text);
        });
    }

    itemsBought.appendChild(createdItem);
    sortItemElements(itemsBought);
}

addItemInput.oninput = function (ev) {
    var currentInput = ev.target.value;
    itemsToAdd.innerHTML = "";
    if (!currentInput) {
        itemsToAdd.style.display = 'none';
        return
    }

    itemsToAdd.style.display = 'block';
    var allInputs = [currentInput];
    for (var i = 0; i < allitems.length; i++) {
        if (allitems[i].name.startsWith(currentInput)) {
            allInputs.push(allitems[i].name);
        }
    }

    for (var i = 0; i < allInputs.length; i++) {
        var newItem = createItemEl(allInputs[i]);
        newItem.onclick = function (ev) {
            var item = ev.target;
            var tergetText = getItemElModel(item);
            createOrUpdateItem(tergetText, false).then(function (result) {
                document.querySelectorAll(".item").forEach(function (x) {
                    if (getItemElModel(x) == tergetText) {
                        x.remove();
                    }
                });

                createItemToBuyEl(tergetText);
                itemsToAdd.innerHTML = '';
                addItemInput.value = '';
                itemsToAdd.style.display = 'none';
            })
        }

        itemsToAdd.appendChild(newItem);
    }
}

function refreshItems() {
    getItems().then(function (items) {
        itemsBought.innerHTML = '';
        itemsToBuy.innerHTML = '';
        allitems = [];
        if (items && items.length > 0) {
            allitems = items;
        }

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item.isBought === 'True') {
                createBoughtItemEl(item.name);
            } else {
                createItemToBuyEl(item.name);
            }
        }
    }).finally(function () {
        setTimeout(function () {
            refreshItems();
        }, 5000);
    });
}

refreshItems();