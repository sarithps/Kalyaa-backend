const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/ProductDb');
const Schema = mongoose.Schema;

var NewOrderSchema = new Schema({
    productId : Number,
    productName : String,
    totalPrice : Number,
    qty: Number,
    name: String,
    address: String,
    pin: Number,
    mobile: Number
});

var Orderdata = mongoose.model('order', NewOrderSchema);

module.exports = Orderdata;