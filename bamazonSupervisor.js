const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');

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
            choices: ["View Product Sales by Department", "Create New Department"]
        }
    ]).then(function (response) {
        console.log(response.viewingOptions);

        if (response.viewingOptions === "View Product Sales by Department") {
            getByDepartment();
        }else{
            addNewDepartment();
        }

        
    });
}

function getByDepartment() {
    let q = `SELECT departments.department_id, department_name, SUM(product_sales) as product_sales, (over_head_costs - product_sales) as total_profit 
              FROM departments LEFT JOIN Products ON products.department_id= departments.department_id GROUP BY department_name`;
    connection.query(q, function (err, result) {
        if (err) throw err;
        let table = '';
        for(let i=0 ; i < result.length; i++){
            table = cTable.getTable(result);
        }
        console.log(table);

        connection.end();
    });
}

function addNewDepartment(){
    inquirer.prompt([{
        type: "input",
        name: "departmentName",
        message: "What is department name you want to add?"
    },
    {
        type: "input",
        name: "overHeadCosts",
        message: "whst is over head costs for this department?",
    }]).then(function(response){
        let q = "INSERT INTO departments SET ?";
        connection.query(q, {
           department_name : response.departmentName,
           over_head_costs : response.overHeadCosts
        }, function (err, result) {
            if (err) throw err;
            console.log(result);
        });

        connection.end();
    });
}