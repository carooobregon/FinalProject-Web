const express = require('express')
const cors = require('cors')
const ejs = require('ejs');
const fs = require('fs');
const multer = require('multer')
const path = require('path');
const crypto = require('crypto');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const axios = require('axios').default

const app = express()
const port = 3000
app.use(cors());
app.use(express.json()); // body-parser
dotenv.config();

app.listen(port, () => {
  console.log(`Your port is ${process.env.PORT}`);
})

// Middleware for avatar upload
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'uploads')
  },
  filename: (req, file, callback) => {
    callback(null, file.fieldname + '-' + Date.now())
  }
});
const upload = multer({ storage: storage});

let ProductModel, UserModel;

// 1. Referencing Mongoose
mongoose.set('useCreateIndex', true);  // remove warning

// 2. Defining products schema
const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    brand: String,
});

const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String},
    hash: {type: String},
    salt : {type: String},
    avatar:
    {
      data: Buffer, // An array
      contentType: String
    }
});

// 3. Connecting with the database
const mongoDB = process.env.MONGOKEY
mongoose.connect(mongoDB, {useUnifiedTopology: true, useNewUrlParser: true })
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
db.once('open', function() {
  console.log('Connected to database server')
  initializeModel()
});

// 4. Create a model from a schema
const initializeModel = () => {
  ProductModel = mongoose.model('Product', productSchema);
  UserModel = mongoose.model('User', userSchema);
}

// Get styles file
app.get('/style.css', (req, res) => {
  res.sendFile("style.css", {root: './'})
})

// PRODUCTS

// Get insert product view file
app.get('/', (req, res) => {
  res.sendFile('productInsert.html', {root: './src/'});
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

// Create new product
app.get('/create', (req,res) => {
  let productName = req.query.name
  let product = {name: productName, price: req.query.price, brand: req.query.brand}
  let newProduct = new ProductModel(product)
  newProduct.save((error) => {
    error ? res.status(404).send() : res.status(200).send(product)
  }
)})

// Get all available products
app.get('/products/all', async (req, res) => {
  let allProducts = await ProductModel.find();
  res.send(allProducts);
})

// Get product with id
app.route('/products/:id').get(async (req, res) => {
  let productId  = req.params.id;
  let product = await ProductModel.findOne({_id: productId});
  product ? res.send(product) : res.status(404).end(`Product with id ${productId} does not exist`)
});

// Update product with id
app.route('/products/:id').put((req, res) => {
  let productId  = req.params.id;
  let{ name, price, brand } = req.body;
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

// Delete product with id
app.route('/products/:id').delete((req, res) => {
  let productId  = req.params.id;
  ProductModel.findOneAndDelete({_id: productId})
  .then(product => res.send(product))
  .catch(err => { console.log(error); res.status(503).end(`Could not delete product ${error}`); });
});

// Send product edit view file with product's corresponding data
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
//Create user view
app.get('/user', (req, res) => {
  res.sendFile('clientInsert.html', {root: './src/'});
})

//Create user with avatar
app.post('/createUser', upload.single('avatar'), (req, res) => {
  console.log("file", req.file, req)
  avatarObject = {
    data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
    contentType: 'image/jpg'
  };
  let user = {
    username: req.body.name,
    email: req.body.email,
    password: req.body.password,
    avatar: avatarObject
  }
  let newUser = new UserModel(user)
  newUser.setPassword(req.body.password)
  newUser.save((error) => {
    error ? res.status(404).send() : res.status(200).send(user)
  });
});

app.get('/addClient.js', (req, res) => {
  res.sendFile("addClient.js", {root: './'})
})

// HASHING PASSWORD
userSchema.methods.setPassword = function(password) { 
  // Creating a unique salt for a particular user 
  this.salt = crypto.randomBytes(16).toString('hex'); 
  // Hashing user's salt and password with 1000 iterations, 
  this.hash = crypto.pbkdf2Sync(password, this.salt,  
  1000, 64, `sha512`).toString(`hex`); 
 }; 
   
 
// Method to check the entered password is correct or not 
userSchema.methods.validPassword = function(password) { 
  var hash = crypto.pbkdf2Sync(password,  
  this.salt, 1000, 64, `sha512`).toString(`hex`); 
  return this.hash === hash; 
}; 