const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000
const axios = require('axios').default
let ProductModel;

app.use(cors());
const dotenv = require('dotenv');
dotenv.config();

// 1. Referencing Mongoose
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);  // remove warning

// 2. Defining the schema
const productSchema = new mongoose.Schema({
    name: {type: String, unique:true, required: true},
    price: {type: Number, required: true},
    brand: String,
});

// 3. Connecting with the database
const mongoDB = process.env.MONGOKEY
mongoose.connect(mongoDB, {useUnifiedTopology: true, useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
    console.log('Connected to database server');
    initializeModel();
});

// 4. Create a model from a schema
function initializeModel(){
  console.log("Initializing the model")
  ProductModel = mongoose.model('Product', productSchema);
}

app.route('/').get((req, res) =>{
  res.sendFile('productInsert.html', {root: './src/'});
});

app.get('/style.css', (req, res) => {
  res.sendFile("style.css", {root: './'})
})

app.get('/products.js', (req, res) => {
  res.sendFile("products.js", {root: './'})
})

app.get('/productList.js', (req, res) => {
  res.sendFile("productList.js", {root: './'})
})

app.get('/products', (req, res) => {
  res.sendFile('productList.html', {root: './src/'});
})

app.get('/create', (req,res) => {
  let productName = req.query.name
  let product = {name: productName, price: req.query.price, brand: req.query.brand}
  let newProduct = new ProductModel(product)
  newProduct.save((error) => {
    error ? res.status(404).send() : res.status(200).send(product)
  }
)})

app.get('/products/all', async (req, res) => {
  let allProducts = await ProductModel.find();
  res.send(allProducts);
})

app.listen(port, () => {
  console.log(`Your port is ${process.env.PORT}`);
})
