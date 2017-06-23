# Bamazon
A Amazon clone using MySQL.  Created by Brian Karabinchak for Rutgers Coding Bootcamp.

## How to Use This
There are two ways to enter Bamazon, either as a customer or a manager.

### Customer View
![Customer View](/images/image1.JPG)

To Use as customer, use <addr>node bamazonCustomers.js</addr>

This then shows you a full list of available items for sale.  Entering an ID of an item that doesn't exist will throw an error.  Entering too many items will throw an error (for example, trying to buy 6 apples when there are only 5).  Otherwise, if all is well, you will recieve a confirmation about what you bought and for how much.

### Manager View
Manager View offers a menu to choose from.
![Manager View](/images/image2.JPG)

#### Option 1 - View Items
![View Items](/images/image3.JPG)

View a complete list of items and all the properities associated with them.
### Option 2 - View Low Inventory
![Low Inventory](/images/image4.JPG)

This option returns all items that have a stock less than or equal to 5.
### Option 3 - Adding to Inventory
![Add Inventory](/images/image5.JPG)

This option allows you to choose what item you want to restock, chosen by ID.  Choosing an ID that doesn't exist will throw an error, as will entering a negative stock number to add.  Otherwise, you will recieve a confirmation with the new stock number.
### Option 4 - Adding a new Product
![Add Item](/images/image6.JPG)

This option allows you to add a new item to the database.  Adding non-numbers or negative numbers to the price/stock will throw an error.  Otherwise, you will get a confirmation about the item you added to the database.
