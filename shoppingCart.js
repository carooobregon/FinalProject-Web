
const productsTable = document.getElementById('productsTable');
const addButton = document.getElementById('btnAdd');
const total = document.getElementById("totalnum");
const buybtn = document.getElementById("buybtn");
var boughtItems = [];
var finalTotal = 0;
var tempVal = 0;
var allPrices = {};

let url = `http://127.0.0.1:3000/products/all`
let ajaxPromise = new Promise((resolve, reject) => {
  let ajaxRequest = new XMLHttpRequest()
  ajaxRequest.open("GET", url)
  ajaxRequest.onreadystatechange = function () {
    if(this.readyState == 4 && this.status == 200) {
      resolve(this.responseText);
    } else if (this.readyState == 4 && this.status !== 200) {
      reject()
    }
  }
  ajaxRequest.send()
})

ajaxPromise.then((response) => {
  populateTable(response)
}).catch(err =>  {
 console.log("ERROR", err)
})

buybtn.addEventListener("click",()=>{
  alert("Bought shopping cart! Your total was $" + finalTotal )
})

function populateTable(products){
  JSON.parse(products).forEach(product => { 
    let row = productsTable.insertRow(); 
    let cellName = row.insertCell();
    let cellPrice = row.insertCell();
    let cellBrand = row.insertCell();
    let cellQuantity = row.insertCell();

    cellName.innerText = product.name;
    cellPrice.innerText = product.price;
    cellBrand.innerText = product.brand ? product.brand : 'none';
    
    amountBox = document.createElement("INPUT")
    amountBox.setAttribute("type", "number");
    amountBox.setAttribute("id", product._id);

    amountBox.addEventListener('click', () => {
      boughtItems.push(product._id)
      var inputVal = document.getElementById(product._id);
      allPrices[product._id] = product.price * inputVal.value
      finalTotal = sumMap()
      console.log(finalTotal,total)
      total.innerText = finalTotal
    });
    cellQuantity.appendChild(amountBox)
  });
}

function sumMap(){
  let sum = 0;
  for (let key in allPrices) {
    sum += allPrices[key];
  }
  return sum
}

const btnLogout = document.getElementById('logout');
btnLogout.addEventListener("click", (e) => {
  axios.post('http://127.0.0.1:3000/logout') // No params, the cookie handles all
    .then(() => {
      alert(`You have been logged out, you are being redirected`);
      window.location.replace('http://127.0.0.1:3000/login');
    })
    .catch(error => {
      alert(`Error: ${error.response.data}`);
  });
});

const editProfile = (userID) =>??{
  window.location.replace(`http://127.0.0.1:3000/userEdit/${userID}/edit`)
}