//Manager View

//Variables and NPM, Database connection
var Inquirer = require('inquirer');
var MySQL = require('mysql');
var Table = require('cli-table');

//global Arr that stores mySql data to make it easier to access
var productsArr = [];

var connection = MySQL.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'Bourassa13!bk',
	database: 'bamazon'
});

//helper functions
function displayAllItems() {
	//create table for display
	var table = new Table ({
		head: ['ID', 'Product', 'Department', 'Price', 'Stock'],
		colWidths: [15,18,18,15,15]
	});

	connection.query('SELECT * FROM products', function(queryerr, res) {
		for(var i = 0; i < res.length; i++) {
			table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
		}

		console.log(table.toString());
	})
};

function displayLowInventory() {
	console.log('low inventory');
	connection.query('SELECT * FROM products WHERE stock_quantity < 5', function(queryerr, res) {
		if(queryerr){
			throw queryerr;
		}
		
		//create table for display
		var table = new Table ({
			head: ['ID', 'Product', 'Department', 'Price', 'Stock'],
			colWidths: [15,18,18,15,15]
		});

		for(var i = 0; i < res.length; i++) {
			table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
		}

		console.log(table.toString());

	})
}

function addToInventory() {
	Inquirer.prompt([
		{
			type: 'input',
			message: 'What item would you like to add more of?',
			name: 'id'
		},
		{
			type: 'input',
			message: 'How many more would you like to add?',
			name: 'stockAdd'
		}
	]).then(function(answers) {
		var id = parseFloat(answers.id);
		var newStock = parseFloat(answers.stockAdd);
		console.log(newStock);
		console.log(isNaN(newStock));
		if(Number.isInteger(newStock) == false || newStock < 0) {
			console.log('Please enter a positive integer for the quantity to add')
		} else{
			connection.query('SELECT * FROM products WHERE item_id=?', [id], function(queryerr, res) {
				if(queryerr){
					throw queryerr;
				}
				
				if(res[0] == undefined) {
					console.log('Bad ID choice, be sure to pick a valid ID');
				} else {
					var previousStock = Number(res[0].stock_quantity);
					console.log(previousStock);
					console.log(isNaN(previousStock));
					console.log(newStock);
					console.log(isNaN(newStock));
					var updatedStock = previousStock+newStock;
					console.log('New Stock is' + updatedStock + ' and ' + isNaN(newStock));
					//UPDATE to new inventory number by adding what was just added to preivous, aka res.stock_quantity
					connection.query('UPDATE products SET stock_quantity=? WHERE item_id=?',[updatedStock, id], function(query2err, resp) {
						if(query2err){
							throw query2err;
						}
						console.log(resp);
					});
				}
			});
		}
	});
}

function addNewProduct() {
	Inquirer.prompt([
		{
			type: 'input',
			message: 'What item do you want to add?',
			name: 'productName'
		}, {
			type: 'input',
			message: 'What department does this item belong to?',
			name: 'departmentName'
		}, {
			type: 'input',
			message: 'What is the price of this item?',
			name: 'price'
		}, {
			type: 'input',
			message: 'How many of this item are you putting in invetory?',
			name: 'stock'
		}
	]).then(function(answers) {
		var price = parseFloat(answers.price);
		var stock = parseFloat(answers.stock);
	
		if(isNaN(price) == true || isNaN(stock) == true) {
			//checking to make sure price and stock are number inputs
			console.log('Please enter a positive price and positive stock integer');
		} else if (price < 0) {
			console.log('Enter a positive price');
		} else if (Number.isInteger(stock) == false) {
			console.log('You can only add a integer number of items to inventory');
		} else if (stock < 0) {
			console.log('You can only add a POSITIVe integer number of items to inventory wiseguy');			
		} else {
			//everythig checks out, add to database
			connection.query('INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?,?,?,?)', 
				[answers.productName, answers.departmentName, price, stock], function(queryerr, res) {
					if(queryerr){
						throw queryerr;
					}
					console.log(res);
				})
		}
	});
}

connection.connect( function(err) {
	if(err){
		throw err;
	}
	
	//Main program loop
	Inquirer.prompt([
			{
				type: 'rawlist',
				message: 'What do you want to do?',
				choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add new Product'],
				name: 'choice',
			}]).then(function(answers) {
				switch(answers.choice){
					case 'View Products for Sale':
						displayAllItems();
						break;
					case 'View Low Inventory':
						console.log('running li');
						displayLowInventory();
						break;
					case 'Add to Inventory':
						addToInventory();
						break;
					case 'Add new Product':
						addNewProduct();
						break;
				}
			});
})