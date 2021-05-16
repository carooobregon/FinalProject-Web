var myForm = document.getElementById("myForm");
const pokemonName = document.getElementById("pokemonQuery");
var elements  = document.getElementById("pokeRow");
var alertBoot = document.getElementById("myAlert");
const prefixUrl = "https://pokeapi.co/api/v2/pokemon/";
const globalWeightElem = document.getElementById("globalW")
let p = document.querySelector("p");

var globalWeightNum = 0;
globalWeightElem.textContent = globalWeightNum;

myForm.onsubmit = (event) => {
    event.preventDefault();
    let pokeName = pokemonName.value.toLowerCase().trim();
    if(!pokeName)
        p.textContent = "Input cannot be empty"
    else{
        let url = `http://127.0.0.1:3000/queryForm/?name=${pokeName}`
        
        let ajaxPromise = new Promise((resolve, reject) => {
            // Initialize the HTTP request.
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            
            // Track the state changes of the request.
            xhr.onreadystatechange = function () {
            var DONE = 4; 
            var OK = 200; 
            if (xhr.readyState === DONE) {
                if (xhr.status === OK) {
                resolve(xhr.responseText);
                } else {
                    print("server", xhr.responseText)
                    alertBoot.textContent = "Pokemon not found!";
                    reject(xhr.status);
                }
            }
            };
            // Send the request to send-ajax-data.php
            xhr.send(null);
        });
        
        ajaxPromise.then((okMessage) => {
            createCard(JSON.parse(okMessage));
            })
        .catch(err =>  {p.innerHTML = err })

        myForm.reset();
        alertBoot.textContent = "";
    }
};

function createCard(obj){
    let colItem =  document.createElement("div");
    colItem.setAttribute("class", "col");
    colItem.style.margin = '20px';
    elements.appendChild(colItem);

    let newitem=document.createElement("div");
    newitem.setAttribute("class", "card");
    newitem.style.width = '200px';
    colItem.appendChild(newitem);
    let cardPic = document.createElement("img");
    cardPic.setAttribute("class", "card-img-top");
    cardPic.src = obj.pic;
    newitem.appendChild(cardPic);
    let pokeInfo = document.createElement("div");
    pokeInfo.setAttribute("class", "card-body");
    newitem.appendChild(pokeInfo);

    let pokeName = document.createElement("h4");
    pokeName.setAttribute("class", "card-title");
    pokeName.textContent = obj.name;
    pokeInfo.appendChild(pokeName);

    let pokeExp = document.createElement("p");
    pokeExp.setAttribute("class", "card-text");
    pokeExp.textContent = "Experience : " + obj.exp;
    pokeInfo.appendChild(pokeExp);

    let pokeHeight = document.createElement("p");
    pokeHeight.setAttribute("class", "card-text");
    pokeHeight.textContent = "Height : " + obj.height ;
    pokeInfo.appendChild(pokeHeight);

    let pokeWeight = document.createElement("p");
    pokeWeight.setAttribute("class", "card-text");
    pokeWeight.setAttribute("id", obj.weight);
    pokeWeight.textContent = "Weight : " + obj.weight;
    pokeInfo.appendChild(pokeWeight);

    pokeWeight.appendChild(createListButton());
    globalWeightNum += obj.weight;
    globalWeightElem.textContent = globalWeightNum
}

function createListButton(){
    let newbtn = document.createElement("button");
    newbtn.addEventListener("click",(event) => {
        let deletedCard = event.target.parentNode.parentNode.parentNode.parentNode;
        let deletedItm = event.target.parentNode;
        let delWeight = deletedItm.getAttribute('id');
        globalWeightNum = globalWeightNum - delWeight;
        globalWeightElem.textContent = globalWeightNum;
        // let cardElem = event.target.parentNode.parentNode
        elements.removeChild(deletedCard);
    });
    newbtn.setAttribute("class", "btn btn-secondary");
    newbtn.appendChild(document.createTextNode("x"));
    return newbtn;
  }
  