//construct main content (item list)
const printMain = function (data) {
    $("#mainDisplay").empty();
    const head = $("<div>");
    head.addClass("row mainListHead");
    head.append(`<div class="col col-2 center">Amount</div>`);
    head.append(`<div class="col col-2 center">Product Name</div>`);
    head.append(`<div class="col col-2 center">Department</div>`);
    head.append(`<div class="col col-2 center">Price</div>`);
    head.append(`<div class="col col-2 center">Stock</div>`);
    head.append(`<div class="col col-2 center">Press to Add to Cart</div>`);
    $("#mainDisplay").append(head);

    data.forEach(function (product) {
        const template = $("<div>");
        template.addClass("row mainList");
        const btn = $("<button>");
        btn.addClass("addCart btn btn-warning");
        btn.attr("btnId", `${product.id}`);
        btn.append("add");
        const btnBox = $("<div>");
        btnBox.addClass("col col-2 mx-auto");
        const amountBox = $("<div>");
        amountBox.addClass("col mx-auto");
        const amountInput = $("<input>");
        amountInput.addClass("amountInput");
        amountInput.attr("type", "text");
        amountInput.attr("id", `${product.id}`);
        amountBox.append(amountInput);
        template.append(amountBox);
        template.append(`<div class="col col-2 center">${product.product_name}</div>`);
        template.append(`<div class="col col-2 center">${product.department_name}</div>`);
        template.append(`<div class="col col-2 center">${product.price}</div>`);
        template.append(`<div class="col col-2 center">${product.stock_quantity}</div>`);
        btnBox.append(btn);
        template.append(btnBox);
        console.log(template);
        $("#mainDisplay").append(template);
    });
}

//user cart array
let userCart = {};

//item prototype
class Item {
    constructor(name, amount, price) {
        this.name = name;
        this.amount = amount;
        this.price = price;
    }
    itemTotal() {
        return this.price * this.amount;
    }
}


//render onto mainDisplay base on user selection
const render = function () {
    let userSelect = $(this).attr("id");
    if (userSelect == "videoGame") {
        userSelect = "Video%20Game"
    }
    if (userSelect == "all") {
        console.log("all");
        $.get("/api/merch", function (data) {
            printMain(data);
        })
    } else {
        console.log(`${userSelect}`);
        $.get(`/api/${userSelect}`, function (data) {
            printMain(data);
        });
    };
}

const addToCart = function () {
    const productId = $(this).attr("btnId");
    const amount = parseInt($(`#${productId}`).val().trim());
    $.get(`/api/merch/${productId}`, function (data) {
        if (amount <= data.stock_quantity) {
            const item = new Item(data.product_name, amount, data.price);
            if (userCart[data.id] !== undefined) {
                if ((userCart[data.id].amount + amount) > data.stock_quantity) {
                    console.log(`sorry, we only have ${data.stock_quantity} ${data.product_name} in stock. 
                    You already have ${userCart[data.id].amount} ${data.product_name} in your cart.`)
                } else {
                    userCart[data.id].amount += amount;
                }
            } else {
                userCart[data.id] = item;
            }
        } else {
            console.log(`sorry, we only have ${data.stock_quantity} ${data.product_name} in stock`);
        }
    })
}

const renderCart = function () {
    $("#myCartBody").empty();
    const head = $("<div>");
    head.addClass("cartItem row");
    head.append(`<div class="col col-3 cartHead">Item</div>`);
    head.append(`<div class="col col-3 cartHead">Quantity</div>`);
    head.append(`<div class="col col-3 cartHead">Price</div>`);
    head.append(`<div class="col col-3 cartHead">Item total</div>`);
    $("#myCartBody").append(head);
    $("#myCartBody").append("<hr>");
    let total = 0;
    for (item in userCart) {
        const cartContainer = $("<div>");
        cartContainer.addClass("container");
        const template = $("<div>");
        template.addClass("cartItem row");
        template.append(`<div class="col col-3 cartList">${userCart[item].name}</div>`);
        template.append(`<div class="col col-3 cartList cartQuant">${userCart[item].amount}</div>`);
        template.append(`<div class="col col-3 cartList">${userCart[item].price}</div>`);
        template.append(`<div class="col col-3 cartList">${(userCart[item].price * userCart[item].amount).toFixed(2)}</div>`);
        total += (userCart[item].price * userCart[item].amount);
        $("#myCartBody").append(template);
        $("#myCartBody").append("<hr>");
    }
    $("#myCartBody").append(`<div class="row cartTotal"><div class="col cartTotal">Total: $${total}</div></div>`);
}

const checkOut = function () {
    let keyCount = 0;
    for (let key in userCart) {
        $.get(`/api/merch/${parseInt(key)}`, function (data) {
            if (data.stock_quantity < userCart[key].amount) {
                const template = $("<div>");
                template.addClass("stockError row");
                const stockError = $("<div>");
                stockError.addClass("col col-12");
                stockError.text(`Sorry, we only have ${data.stock_quantity} ${data.product_name} in stock. You have ${userCart[key].amount} ${data.product_name} in cart.`);
                template.append(stockError);
                $("#checkOutResultBody").append(template);
                userCart = {};
            } else {
                console.log(userCart[key]);
                const newQuantity = data.stock_quantity - userCart[key].amount;
                const updatedStock = { stock_quantity: newQuantity };
                $.ajax({
                    url: `/api/merch/${parseInt(key)}`,
                    method: "PUT",
                    data: updatedStock
                }).then(function () {
                    $("#checkOutResultBody").text("Success!");
                }).catch(function (err) {
                    console.log({ err: err });
                });
            }
        }).then(function(){
            keyCount++;
            if (keyCount >= Object.keys(userCart).length) {
                userCart = {};
            }
        }).catch(function (err) {
            console.log({ err: err });
        });
    };
}

$("#deptRow").on("click", ".deptBtn", render);

$("#mainDisplay").on("click", ".addCart", addToCart);

$("#viewCart").click(renderCart);

$("#checkOut").click(checkOut);

$("#checkOutClose").click(renderCart);

$("#cartClose").click(render);