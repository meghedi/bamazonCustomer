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
            choices: ["View Product Sales by Department", "Create New Department"]
        }
    ]).then(function (response) {
        console.log(response.viewingOptions);

        if(response.viewingOptions === "View Product Sales by Department"){
            getByDepartment();
        }
    });
}

function getByDepartment(){
    connection.query("SELECT * FROM departments GROUP BY department_name", function(err, result){
        if(err) throw err;
        console.log(result);
    });
}