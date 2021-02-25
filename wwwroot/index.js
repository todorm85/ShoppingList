var itemsToAdd = document.getElementById("itemsToAdd");
var itemsToBuy = document.getElementById("itemsToBuy");
var itemsBought = document.getElementById("itemsBought");
var addItemInput = document.getElementById("addItemInput");
var loading = document.getElementById("loading");
var allitems = [];
var isLoading = 0;

function createItemElement(text, isBought) {
    var createdItem = createItemEl(text);
    createdItem.onclick = function () { onItemClick(this, !isBought) };
    var container = isBought ? itemsBought : itemsToBuy;
    container.appendChild(createdItem);
    sortItemElements(itemsToBuy);
}

function onItemClick(item, isBought) {
    var text = getItemElModel(item);
    setItemElLoading(item, true);
    isLoading++;
    createOrUpdateItem(text, isBought).then(function (res) {
        item.remove();
        createItemElement(text, isBought);
    }, function () {
        setItemElLoading(item, false);
    }).finally(function () {
        isLoading--;
    });
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
    isLoading++;
    createOrUpdateItem(name, false).then(function (result) {
        document.querySelectorAll(".item").forEach(function (x) {
            if (getItemElModel(x) == name) {
                x.remove();
            }
        });

        createItemElement(name, false);
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

    getItems().then(function (items) {
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

            if (!(hasItemElement(newContainer, item.name))) {
                createItemElement(item.name, item.isBought === 'True');
            }

            var previousNode = getItemElement(oldContainer, item.name);
            if (previousNode) {
                previousNode.remove();
            }
        }
    }).finally(function () {
        setTimeout(function () {
            refreshItems();
        }, 5000);
    });
}

refreshItems();