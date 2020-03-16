const mysql = require("mysql");
const inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    start();
});

function start() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        let tableHtml = '';
        for (var i = 0; i < results.length; i++) {
            tableHtml += `product: ${results[i].product_name} | department: ${results[i].department_name} | price: ${results[i].price} | quantity: ${results[i].stock_quantity}
           ==============================\n`
        }
        console.log(tableHtml);
        buyingOptions();
    });
}

function buyingOptions() {
    inquirer.prompt([
        {
            type: "input",
            name: "productId",
            message: "What is product ID you want to buy?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            type: "input",
            name: "units",
            message: "How many units of the product they would like to buy?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ]).then(function (response) {
        console.log(response.productId, response.units);
        compareQuantity(response.productId, response.units);
    });
}

function compareQuantity(productId, units) {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        for (var i = 0; i < results.length; i++) {
            if (results[i].item_id === parseInt(productId)) {
                console.log("equal");
                if (units > results[i].stock_quantity) {
                    console.log(units, results[i].stock_quantity, "Insuficient quantity!");
                    return;
                } else {
                    console.log("\n==========order placed==========\n");
                    let quantityLeft = parseInt(results[i].stock_quantity - units);
                    let totalPrice = parseFloat(results[i].price * units);
                    updateDatabase(productId, quantityLeft, totalPrice);
                }
            }
        }

    });
}


function updateDatabase(productId, quantityLeft, totalPrice) {
    connection.query("Update products Set ? where ?",
        [
            {
                stock_quantity: quantityLeft
            },
            {
                item_id: productId
            }
        ],
        function (err, results) {
            if (err) throw err;
            console.log("\n===========Order updated=============\n");
            console.log(`Total Price : ${totalPrice}`);
            connection.end();
        });

}