/*
	Use Bamazon as though you are a customer.  Shop and buy
	items and update the inventory respectively.
*/

//Variables and NPM, Database connection
var Inquirer = require('inquirer');
var MySQL = require('mysql');
//global Arr that stores mySql data to make it easier to access
var productsArr = [];

var connection = MySQL.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'Bourassa13!bk',
	database: 'bamazon'
});

//Helper functions
function getInput(products){
	Inquirer.prompt([
		{
			type: 'input',
			message: 'What is the ID of the item you want to buy?',
			name: 'product_id',
		}, {
			type: 'input',
			message: 'How many of this product do you want?',
			name: 'product_quantity'
		}
	]).then(function(answers) {
			//if one of the inputs is bad, deal with that first
		if (Number.isInteger(parseFloat(answers.product_id)) == false || Number.isInteger(parseFloat(answers.product_quantity)) == false) {
			console.log('Please only enter positive integers for product ID and quantity');
		} else {
			//both entrys are integers, set to variables to make easier
			var id = answers.product_id;
			var stock = answers.product_quantity;
			//check to see if ID is valid
			if (id > 10 || id < 1) {
				console.log('Sorry, that ID is invalid.  Please select between 1 and 10.');
			} else if (products[id-1][3] < stock) {
				//it's id-1 since our id's are 1-10, but our array is 0-9
				//not enough product for demand
				console.log('Sorry, we don\'t have as many ' + products[id-1][0] + ' as you need.');
			} else {
				//we have a ok ID, and we have enough item in stock
				//put a wrapper around the price to limit it to 2 decimals
				console.log('You just bought ' + stock + ' ' + products[id-1][0] + '\'s for $' + (stock*products[id-1][2]));
				//UPDATE STOCK QUANTITY
				connection.query('UPDATE products SET stock_quantity=? WHERE item_id=?', [products[id-1][3]-stock, id] , function(queryerr, res) {
					if(queryerr){
						throw queryerr;
					}
					console.log('Updated Stock Quantity of ' + products[id-1][0] + ' to ' + (products[id-1][3]-stock));
				});
			}
		}
	});
};

function displayAllItems(){
	connection.query('SELECT * FROM products', function(queryerr, res) {
		if(queryerr){
			throw queryerr;
		}

		for(var i = 0; i<res.length; i++){
			console.log('ID: ' + res[i].item_id + ', Product: ' + res[i].product_name + ' Price: $' + res[i].price );
			//since displayAllItems runs first thing, now is a good time to make productsArr
			productsArr.push([res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
		}
		getInput(productsArr);
	});
};

connection.connect( function (err) {

	if(err){
		throw err;
	}

	console.log('Connected to Bamazon');

	displayAllItems();

});