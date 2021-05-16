const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000
const axios = require('axios').default
var PokeModel;

app.use(cors());
const dotenv = require('dotenv');
dotenv.config();

let pokeCache = new Map()

// 1. Referencing Mongoose
const mongoose = require('mongoose');
// remove a warning
mongoose.set('useCreateIndex', true); 

// 2. Defining the schema
console.log("Defining the schema")
const pokemonSchema = new mongoose.Schema({
    name: {type: String, unique:true, required: true},
    weight: Number,
    height: Number,
    pic: String,
    exp: Number
});

// 3. Connecting with the database
// const mongoDB = 'mongodb://localhost/movies';
// var mongoDB = 'mongodb+srv://root:root@mycluster.tosad.mongodb.net/movies?retryWrites=true&w=majority';
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
  PokeModel = mongoose.model('Pokemon', pokemonSchema);
}


app.get('/queryForm', (req,res) => {
  let pokemonName = req.query.name
  const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
  if (pokeCache.has(pokemonName)) {
    res.status(200).send(pokeCache.get(pokemonName));
  }
  else {
    axios.get(url).then((response) => {
      let poke_data = response.data;
      PokeModel.findOne({name: poke_data.name}).exec((err, doc) => {
        if (doc) {
           doc.toObject({ getters: true })
           res.status(200).send(doc);
        }else{
          addPokemonToCache(poke_data)
          res.status(200).send(returnPokeObject(poke_data));
        }
      })     
    }).catch ((error) => {
      res.status(404).send()
    })
  }
})

app.route('/pokemons').get(async function(req, res){    
  let allPokemons = await PokeModel.find();
  res.send(allPokemons);
});

function returnPokeObject(poke_data){
    return {
        name: poke_data.name,
        weight: poke_data.weight,
        height: poke_data.height,
        pic: poke_data.sprites.front_default,
        exp: poke_data.base_experience
    };
}

function addPokemonToCache(poke_data){
  pokeObj = returnPokeObject(poke_data)
  let curr_pokemon = new PokeModel({name: pokeObj.name, weight: pokeObj.weight, height: pokeObj.height, pic: pokeObj.pic, exp: pokeObj.exp});
  pokeCache.set(poke_data.name, returnPokeObject(poke_data));

  curr_pokemon.save();
}

app.listen(port, () => {
  console.log(`Your port is ${process.env.PORT}`); // 8626
})
