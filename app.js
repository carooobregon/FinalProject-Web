const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000
const axios = require('axios').default
const ejs = require('ejs');

let ProductModel, UserModel;

app.use(cors());
app.use(express.json()); // body-parser

const dotenv = require('dotenv');
dotenv.config();

// 1. Referencing Mongoose
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);  // remove warning

// 2. Defining the schema
const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    brand: String,
});

const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String},
    password: {type: String},
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
  UserModel = mongoose.model('User', userSchema);
}

app.route('/').get((req, res) =>{
  res.sendFile('productInsert.html', {root: './src/'});
});

app.get('/style.css', (req, res) => {
  res.sendFile("style.css", {root: './'})
})

// PRODUCTS
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

app.route('/products/:id').get(async (req, res) => {
  let productId  = req.params.id;
  let product = await ProductModel.findOne({_id: productId});
  if (product)
      res.send(product);
  else
      res.status(404).end(`Product with id ${productId} does not exist`)
});

app.route('/products/:id').put((req, res) => {
  let productId  = req.params.id;
  let{ name, price, brand } = req.body;
  console.log(req.body)
  ProductModel.findOneAndUpdate(
      {_id: productId}, // selection criteria
      {
          name: name,
          price: price,
          brand: brand
      }
  )
  .then(product => res.send(product))
  .catch(err => { console.log(error); res.status(503).end(`Could not update product ${error}`); });
});

app.route('/products/:id').delete((req, res) => {
  let productId  = req.params.id;
  ProductModel.findOneAndDelete({_id: productId})
  .then(product => res.send(product))
  .catch(err => { console.log(error); res.status(503).end(`Could not delete product ${error}`); });
});

app.route('/products/:id/edit').get((req, res) => {
  let productId  = req.params.id;

  ejs.renderFile('./src/productEdit.html', {productId: productId}, null, function(err, str){
      if (err) res.status(503).send(`error when rendering the view: ${err}`);
      else {
          res.end(str);
      }
  });
});

// USERS
app.get('/user', (req, res) => {
  res.sendFile('clientInsert.html', {root: './src/'});
})

app.listen(port, () => {
  console.log(`Your port is ${process.env.PORT}`);
})

app.get('/createUser', (req,res) => {
  console.log(req.query)
  let user = {
              username: req.query.username,
              email: req.query.email,
              password: req.query.password
            }
  console.log(user)
  let newUser = new UserModel(user)
  newUser.save((error) => {
    error ? res.status(404).send() : res.status(200).send(user)
  }
)});

app.get('/addClient.js', (req, res) => {
  res.sendFile("addClient.js", {root: './'})
})
