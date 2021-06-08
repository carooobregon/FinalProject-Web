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
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const app = express()
const port = 3000 // Port using
const secret = '5tr0n6P@55W0rD!' // Secret password to create tokens

app.use(cors());
app.use(express.json()); // body-parser
app.use(cookieParser())
dotenv.config();

app.listen(port, () => {
  console.log(`Your port is ${process.env.PORT}`);
})

// Generate token on login and user exists
const generateToken = (user) => {
  let payload = { //values grabbed from allUsers array (change to values of db)
    userEmail: user.userEmail,
    id: user._id,
    role: user.role,
    username: user.username,
  };
  let oneDay = 60 * 60 * 24; // token valid for 1 day
  return token = jwt.sign(payload, secret, { expiresIn: oneDay });
}

// Middleware that verifies if user has a token in the cookie (meaning user is logged in)
const requireLogin = (req, res, next) => {
  let accessToken = req.cookies.authorization
  if (!accessToken){  // if there's no token stored in cookies user is unauthorized
    console.log('Unauthorized user, redirecting to login page'); 
    return res.redirect('/login');  // redirect to login
  }
  try{
    payload = jwt.verify(accessToken, secret) // verify the access token, throws error if token expires or invalid signature
    req.user = payload; // Add payload to request if necessary (to give a personal welcoming). Payload is user's info (username, role, etc)
    next()
  }
  catch(e){
    res.redirect(403, '/login'); //on error return unauthorized error and redirect to login
  }
}

// Middleware to handle avatar upload
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

// Referencing Mongoose
mongoose.set('useCreateIndex', true);

// Defining products' schema
const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    brand: String,
});

// Defining users' schema
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

// Connecting with the database
const mongoDB = process.env.MONGOKEY
mongoose.connect(mongoDB, {useUnifiedTopology: true, useNewUrlParser: true })
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
db.once('open', function() {
  console.log('Connected to database server')
  initializeModel()
});

// Create a model from a schema
const initializeModel = () => {
  ProductModel = mongoose.model('Product', productSchema);
  UserModel = mongoose.model('User', userSchema);
}

// Get styles file
app.get('/style.css', (req, res) => {
  res.sendFile("style.css", {root: './'})
})

// PRODUCTS

// Get insert product view file. Requires login
app.get('/addProduct', requireLogin, (req, res) => {
  res.sendFile('productInsert.html', {root: './src/'});
})

// Get product list view file where admin can add product. Requires login
app.get('/admin', requireLogin, (req, res) => {
  res.sendFile('productList.html', {root: './src/'});
})

// Get normal user's view file where user can buy products. Requires login
app.get('/', requireLogin, (req, res) => {
  ejs.renderFile('./src/shoppingcart.html', {user: req.user}, null, function(err, str){
    if (err) res.status(503).send(`error when rendering the shoppingcart view: ${err}`); 
    else {
      res.end(str);
    }
  });
})

app.get('/products.js', (req, res) => {
  res.sendFile("products.js", {root: './'})
})

app.get('/productList.js', (req, res) => {
  res.sendFile("productList.js", {root: './'})
})

app.get('/shoppingCart.js', (req, res) => {
  res.sendFile("shoppingCart.js", {root: './'})
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
  .catch(err => { console.log(err); res.status(503).end(`Could not update product ${error}`); });
});

// Delete product with id
app.route('/products/:id').delete((req, res) => {
  let productId  = req.params.id;
  ProductModel.findOneAndDelete({_id: productId})
  .then(product => res.send(product))
  .catch(err => { console.log(err); res.status(503).end(`Could not delete product ${err}`); });
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

//Send login user view
app.get('/login', (req, res) => {
  res.sendFile('login.html', {root: './src/'});
})

//Send signup user view
app.get('/signup', (req, res) => {
  res.sendFile('signUp.html', {root: './src/'});
})

// Logout user. Requires login.
app.post('/logout', requireLogin, function(req, res){
  res.clearCookie('authorization');
  res.send('User logged out');
});

// Verify user exists and generate token if it does
app.post('/login', async (req, res) => {
  const { userEmail, password } = req.body;
  const user = await UserModel.findOne({email: userEmail})  
  if (user) {
    const accessToken = generateToken(user); // Generate access token
    res.cookie("authorization", accessToken, {secure: true, httpOnly: true});
    res.status(200).json(accessToken);
  }else{
    res.status(403).send('You don`t have an account'); // User doesn't exist
  }
})

// Create user with avatar
app.post('/createUser', upload.single('avatar'), (req, res) => {
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

// Logout user
app.get('/userEdit/:id/edit', requireLogin, (req, res) => {
  let userId  = req.params.id;
  ejs.renderFile('./src/userEdit.html', {userId: userId}, null, function(err, str){
    if (err) res.status(503).send(`error when rendering the view: ${err}`);
    else {
      res.end(str);
    }
  });
})

// Get user with id
app.route('/userEdit/:id').get(async (req, res) => {
  let userId  = req.params.id;
  const user = await UserModel.findOne({_id: userId}) 
  user ? res.send(user) : res.status(404).end(`User with id ${userId} does not exist`)
});

// Update user with id
app.route('/userEdit/:id').put((req, res) => {
  let userId  = req.params.id;
  let{ userName, userEmail } = req.body;
  UserModel.findOneAndUpdate(
    {_id: userId},
    {
      username: userName,
      email: userEmail,
    }
  )
  .then(user => {
    res.send(user)
  })
  .catch(err => { console.log(err); res.status(503).end(`Could not update user ${error}`); });
});

// Delete user with id
app.route('/userEdit/:id').delete((req, res) => {
  let userId  = req.params.id;
  UserModel.findOneAndDelete({_id: userId})
  .then(user => res.send(user))
  .catch(err => { console.log(err); res.status(503).end(`Could not delete user ${err}`); });
});

// SignUp JS file
app.get('/signUp.js', (req, res) => {
  res.sendFile("signUp.js", {root: './'})
})

// Login JS file
app.get('/loginClient.js', (req, res) => {
  res.sendFile("loginClient.js", {root: './'})
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