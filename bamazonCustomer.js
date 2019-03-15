var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "testingPassword",
  database: "bamazon"
});

connection.connect(function (err) {
  if (err) throw err;
  getCatalogue();
});

function getCatalogue() {
  
    var allProds = null;
    var query = "SELECT * FROM products";
    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log("ID: " + res[i].id + " || Product Name: " + res[i].product_name + " || Department: " + res[i].department_name + " || Price: " + res[i].price + " || Stock: " + res[i].stock_quantity);
        }
        allProds = res;
    });


    inquirer
    .prompt({
        name: "product_to_buy",
        type: "input",
        message: "Please input the ID number of the item you would like to purchase.",
    })
    .then(function (answer) {
        if(answer.product_to_buy > allProds.length) {
            console.log("That index is larger than the index of any of our items.");
        } else if(answer.product_to_buy <= 0) {
            console.log("That index is smaller than the index of any of our items.");
        } else {
            // Do the second prompt
            inquirer
                .prompt({
                    name: "number_to_buy",
                    type: "input",
                    message: "Please input the number of that item you would like to purchase.",
                })
                .then(function (ans) {
                    if(ans.number_to_buy > allProds[answer.product_to_buy - 1].stock_quantity) {
                        console.log("We do not have enough of that item in stock to fulfill your request. Sorry!");
                    } else if(ans.number_to_buy <= 0) {
                        console.log("Requested quantity must be at least 1.");
                    } else {
                        console.log(allProds[answer.product_to_buy - 1].product_name + " x" + ans.number_to_buy + " added to your cart.");
                        console.log("Your total price today is $" + (parseFloat((allProds[answer.product_to_buy - 1].price.replace("$",""))) * 2));
                    }
                });
        }
    });

    connection.end();
}