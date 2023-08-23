/*
Planter shape navigation
*/
function planterPage(page) {
    var xml = new XMLHttpRequest();
    xml.onreadystatechange = function () {
        if (xml.readyState == 4 && xml.status == 200) {
            document.getElementById("planterDetails").innerHTML = xml.responseText;
        }
    };
    xml.open("GET", page, true);
    xml.send();

    document.getElementsByClassName("active")[0].setAttribute("class", "");
    document.getElementById(page).setAttribute("class", "active");
    planterCost = 0;
    document.getElementById("planterCostSpan").innerHTML = "$0.00";
}

function changeImg(src) {
    document.getElementById("mainShopImg").setAttribute("src", src);
}

/*
Planter cost and shopping cart
*/
var planter = {
    type: "",
    dimensions: "",
    volume: "",
    cost: 0,
    toStringCart: function() {
        return "<li onclick=\"enableDelete()\">" +
            "<p style=\"display: inline-block; width: 70%;\">" +
                "<input type=\"checkbox\" class=\"shoppingCartItem\" name=\"shoppingCartItem\"> &nbsp;" +
                this.type +
                "</p>" +
                "<p style=\"display: inline-block; text-align: right; width: 20%;\">" +
                "$" + this.cost.toFixed(2) +
            "</p>" +
        "</li>";},
    toStringInvoice: function() {
        return "<li style=\"float: left; width: 30%;\">" +
        "<b>" + this.type + "</b>" +
        "</li>" +
        "<li style=\"float: left; width: 30%;\">" +
            "$" + this.cost.toFixed(2) +
       "</li>" +
        "<li style=\"float: left; width: 100%; padding-left: 1rem;\">" +
            "Dimensions: " +
        "</li>" +
        "<li style=\"float: left; width: 100%; padding-left: 2.5rem;\">" +
            this.dimensions +
        "</li>" +
        "<li style=\"float: left; width: 100%; padding-left: 1rem;\">" +
            "Volume: " +
        "</li>" +
        "<li style=\"float: left; width: 100%; padding-left: 2.5rem;\">" +
            this.volume + " cm&sup3;" +
            "<br><br>" +
        "</li>";}
};

var shoppingCart = [];
var totalCost = 0;
var items = "";

//Calculate cost of items
function calculateVolume(shape) {
    var planterCost = 0;
    var volume = 0;
    var rectangularCost = 0.001;
    var cylinderCost = 0.0012;
    var sphereCost = 0.0015;
    var coneCost = 0.002;

    switch (shape) {
        case "rectangle":
            volume = rectangularVolume();
            planterCost = volume * rectangularCost;
            break;
        case "cylinder":
            volume = cylinderVolume();
            planterCost = volume * cylinderCost;
            break;
        case "sphere":
            volume = sphereVolume();
            planterCost = volume * sphereCost;
            break;
        case "cone":
            volume = coneVolume();
            planterCost = volume * coneCost;
    }
    planter.cost = planterCost;
    shopResult(volume.toFixed(0));
}

function rectangularVolume() {
    var length = document.getElementById("rectangularLength").value;
    var width = document.getElementById("rectangularWidth").value;
    var height = document.getElementById("rectangularHeight").value;
    var volume = length * width * height;
    planter.type = "Rectangular Planter";
    planter.dimensions = "Length: " + length + " cm <br>" +
        "Width: " + width + " cm <br>" +
        "Height: " + height + " cm";
    planter.volume = volume.toFixed(0);
    return volume;
}

function cylinderVolume() {
    var radius = document.getElementById("cylinderRadius").value;
    var height = document.getElementById("cylinderHeight").value;
    var volume = Math.PI * radius * radius * height;
    planter.type = "Flat Bottomed Cylinder Planter";
    planter.dimensions = "Radius: " + radius + " cm <br>" +
        "Height: " + height + " cm";
    planter.volume = volume.toFixed(0);
    return volume;
}

function sphereVolume() {
    var radius = document.getElementById("sphereRadius").value;
    var volume = (1 / 2) * ((4 / 3) * Math.PI * radius * radius * radius);
    planter.type = "Half Sphere Planter";
    planter.dimensions = "Radius: " + radius + " cm";
    planter.volume = volume.toFixed(0);
    return volume;
}

function coneVolume() {
    var radius1 = document.getElementById("coneRadius1").value;
    var radius2 = document.getElementById("coneRadius2").value;
    var height = document.getElementById("coneHeight").value;
    var volume = (1 / 3) * Math.PI * (radius1 * radius1 + radius1 * radius2 + radius2 * radius2) * height;
    planter.type = "Truncated Cone Planter";
    planter.dimensions = "Large Radius: " + radius1 + " cm <br>" +
        "Small Radius: " + radius2 + " cm <br>" +
        "Height: " + height + " cm";
    planter.volume = volume.toFixed(0);
    return volume;
}

function shopResult(volume) {
    document.getElementById("volumeResult").innerHTML = " &emsp; " + volume + " cm&sup3;";
    document.getElementById("planterCostSpan").innerHTML = "$" + planter.cost.toFixed(2);
}

function addToCart() {
    var newPlanter = new Object();
    newPlanter.type = planter.type;
    newPlanter.dimensions = planter.dimensions;
    newPlanter.volume = planter.volume;
    newPlanter.cost = planter.cost;
    newPlanter.toStringCart = planter.toStringCart;
    newPlanter.toStringInvoice = planter.toStringInvoice;

    if (newPlanter.cost < 4.99) {
        alert("Planter must be at least $5.00");
    } else {
        shoppingCart.push(newPlanter);
        var item = newPlanter.toStringCart();
        items += item;
        totalCost += newPlanter.cost;
    }

    document.getElementById("items").innerHTML = items;
    document.getElementById("total").innerHTML = "$" + totalCost.toFixed(2);
}

function enableDelete() {
    var checkBoxes = document.getElementsByClassName("shoppingCartItem");
    var enable = true;
    var disabled = "disabled button"
    for (var x = 0; x < checkBoxes.length; x++) {
        if(checkBoxes[x].checked == true) {
            enable = false;
            disabled = "button"
        }
    }
    document.getElementById("delete").setAttribute("class", disabled);
    document.getElementById("delete").disabled = enable;
}

function deleteCartItem() {
    var checkBoxes = document.getElementsByClassName("shoppingCartItem");
    var checkBoxesLength = checkBoxes.length-1;
    for (var x = checkBoxesLength; x >= 0; x--) {
        if(checkBoxes[x].checked == true) {
            shoppingCart.splice(x, 1);
        }
    }
    totalCost = 0;
    items = "";
    for (var x = 0; x < shoppingCart.length; x++) {
        totalCost += shoppingCart[x].cost;
        var item = shoppingCart[x].toStringCart();
        items += item;
    }
    document.getElementById("items").innerHTML = items;
    document.getElementById("total").innerHTML = "$" + totalCost.toFixed(2);
    document.getElementById("delete").disabled = true;
    document.getElementById("delete").setAttribute("class", "disabled button");
}

/*
Shipping form
*/
function shippingInfo() {
    if (totalCost == 0) {
        console.log("empty shopping cart");
    } else {
        var xml = new XMLHttpRequest();
        xml.onreadystatechange = function () {
            if (xml.readyState == 4 && xml.status == 200) {
                document.getElementById("shippingInfo").innerHTML = xml.responseText;
            }
        };
        xml.open("GET", "shippingForm.html", true);
        xml.send();
        document.getElementById("shippingFormLink").style.opacity = "1";
    }
}

function invoice() {
    document.getElementById("linkToInvoice").style.opacity = "1";

    document.getElementById("invoiceDisplay").style.opacity = "1";
    document.getElementById("invoiceDisplay").style.height = "auto";
    //customer info
    var name = document.getElementById("firstNameInput").value + " " + document.getElementById("lastNameInput").value;
    var address = document.getElementById("addressInput").value;
    var city = document.getElementById("cityInput").value;
    var province = document.getElementById("provinceInput").value;
    var postalCode = document.getElementById("postalCodeInput").value;
    var customerInfo = 
        "<h4 class=\"formHeader2\">" + name + "</h4>" +
        address + 
        "<br>" +
        city + " " + province +
        "<br>" +
        postalCode;

    //Order items
    var items = "";
    for(var x = 0; x < shoppingCart.length; x++) {
        var item = shoppingCart[x].toStringInvoice();
        items += item;
    }
    document.getElementById("invoiceCustomerInfo").innerHTML = customerInfo;
    document.getElementById("invoiceOrderItems").innerHTML = items;
    document.getElementById("invoiceTotal").innerHTML = "$" + totalCost.toFixed(2);
}