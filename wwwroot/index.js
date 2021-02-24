var itemsToAdd = document.getElementById("itemsToAdd");
var itemsToBuy = document.getElementById("itemsToBuy");
var itemsBought = document.getElementById("itemsBought");
var addItemInput = document.getElementById("addItemInput");
var loading = document.getElementById("loading");
var allitems;
var isLoading = 0;

function createItemToBuyEl(text) {
    var createdItem = createItemEl(text);
    createdItem.onclick = function () { onItemClick(this, true) };

    itemsToBuy.appendChild(createdItem);
    sortItemElements(itemsToBuy);
}

function onItemClick(item, isBought) {
    var text = getItemElModel(item);
    setItemElLoading(item, true);
    isLoading++;
    createOrUpdateItem(text, isBought).then(function (res) {
        item.remove();
        if (isBought) {
            createBoughtItemEl(text);
        } else {
            createItemToBuyEl(text);
        }
    }, function () {
        setItemElLoading(item. false);
    }).finally(function () {
        isLoading--;
    });
}

function createBoughtItemEl(text) {
    var createdItem = createItemEl(text);
    createdItem.onclick = function () { onItemClick(this, false) };

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
            var item = this;
            setItemElLoading(item);
            var tergetText = getItemElModel(item);
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
    createOrUpdateItem(name, false).then(function (result) {
        document.querySelectorAll(".item").forEach(function (x) {
            if (getItemElModel(x) == name) {
                x.remove();
            }
        });

        createItemToBuyEl(name);
        itemsToAdd.innerHTML = '';
        addItemInput.value = '';
        itemsToAdd.style.display = 'none';
    })
}

function refreshItems() {
    if (isLoading > 0) {
        setTimeout(function () {
            refreshItems();
        }, 5000);

        return;
    }

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