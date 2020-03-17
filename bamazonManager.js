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
    inquirer.prompt([
        {
            type: "list",
            name: "viewingOptions",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }
    ]).then(function (response) {
        console.log(response.viewingOptions);
        let optionSelected = response.viewingOptions;
        switch (optionSelected) {
            case "View Products for Sale":
                return viewProductsForSale();
            case "View Low Inventory":
                return viewLowInventory();
            case "Add to Inventory":
                return addToInventory();
            case "Add New Product":
                return addNewProduct();
        }

    });
}

function viewProductsForSale() {
    connection.query("SELECT * FROM products WHERE stock_quantity > 0", function (err, results) {
        if (err) throw err;
        console.log(results); let tableHtml = '';
        for (var i = 0; i < results.length; i++) {
            tableHtml += `product: ${results[i].product_name} | department: ${results[i].department_name} | price: ${results[i].price} | quantity: ${results[i].stock_quantity}
           ==============================\n`
        }
        console.log(tableHtml);
        start();
    });
}

function viewLowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, results) {
        if (err) throw err;
        let tableHtml = '';
        for (var i = 0; i < results.length; i++) {
            tableHtml += `product: ${results[i].product_name} | department: ${results[i].department_name} | price: ${results[i].price} | quantity: ${results[i].stock_quantity}
           ==============================\n`
        }
        console.log(tableHtml);
        start();
    });
}

function addToInventory() {
    inquirer.prompt([{
        type: "input",
        name: "productName",
        message: "which product you want to add more?"
    }, {
        type: "input",
        name: "countToAdd",
        message: "New Quantity?",
        validate: function (value) {
            if (isNaN(value) === false) {
                return true;
            }
            return false;
        }
    }
    ]).then(function (response) {
        connection.query("UPDATE products SET ? WHERE ?", [
            {
                stock_quantity: parseInt(response.countToAdd)
            }, {
                product_name: response.productName
            }], function (err, results) {
                if (err) throw err;
                console.log(results.affectedRows + " products updated!\n");
                start();
            });
    });
}

function addNewProduct() {
    let departmentName = '';

    inquirer.prompt([{
        type: "input",
        name: "productName",
        message: "which product you want to add?"
    },
    {
        type: "input",
        name: "departmentId",
        message: "which department?",
        validate: function (value) {
            if (isNaN(value) === false) {
                return true;
            }
            return false;
        }
    }, {
        type: "input",
        name: "quantity",
        message: "How many?",
        validate: function (value) {
            if (isNaN(value) === false) {
                return true;
            }
            return false;
        }
    }, {
        type: "input",
        name: "price",
        message: "price to include?",
        validate: function (value) {
            if (isNaN(value) === false) {
                return true;
            }
            return false;
        }
    }
    ]).then(function (response) {
        connection.query("SELECT department_name FROM departments where ?", {
            department_id: response.departmentId
        },
            function (err, results) {
                connection.query("INSERT INTO products SET ?", {
                    product_name: response.productName,
                    department_id: response.departmentId,
                    price: response.price,
                    stock_quantity: response.quantity
                }, function (err, res) {
                    console.log("\n==============One row Inserted=========");
                });
            });

            connection.end();
    });
}