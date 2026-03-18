// Product Inventory System
// Product Inventory System

let product = {
    name: "Laptop",
    price: 50000,
    quantity: 3,

    displayDetails: function () {
        console.log("Product:", this.name);
        console.log("Price:", this.price);
        console.log("Quantity:", this.quantity);
    },

    totalValue: function () {
        return this.price * this.quantity;
    }
};

// Display product details
product.displayDetails();

// Calculate total stock value
console.log("Total Stock Value:", product.totalValue());