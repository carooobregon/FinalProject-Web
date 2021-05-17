let productForm = document.getElementById("productForm")
let totalPrice = 0

// create warnings when product's inputs are empty
const addWarning = (text) => {
  let warning = document.getElementById('warning')
  warning.setAttribute("class", "alert alert-warning")
  warning.appendChild(document.createTextNode(text))

  // Remove warning
  setTimeout(() => {
    warning.className += ' hidden'
    warning.innerHTML = ''
  }, 2000);
}

// add product
const addProduct = (prodObj) => {
  totalPrice += parseFloat(prodObj.price) //modify total price
  document.getElementById('totalPrice').innerHTML = parseFloat(totalPrice).toFixed(2)

  let productList = document.getElementById('productList')
  let newCard = document.createElement('div')
  newCard.setAttribute("class", "card")
  let newCardBody = document.createElement('div')
  newCardBody.setAttribute("class", "card-body")

  let h5 = document.createElement('h5')
  h5.appendChild(document.createTextNode(prodObj.name))
  h5.setAttribute("class", "card-title")

  let firstP = document.createElement('p')
  firstP.appendChild(document.createTextNode(`Price: ${prodObj.price}`))
  firstP.setAttribute("class", "card-text")

  let secondP = document.createElement('p')
  secondP.appendChild(document.createTextNode(`Brand: ${prodObj.brand}`))
  secondP.setAttribute("class", "card-text")

  let removeButton = document.createElement('button')
  removeButton.addEventListener('click', (e) => {
    let target = e.target.parentNode.parentNode
    console.log(target)
    totalPrice -= parseFloat(prodObj.price) //modify total price
    document.getElementById('totalPrice').innerHTML = parseFloat(totalPrice).toFixed(2)
    productList.removeChild(target)
  })

  removeButton.appendChild(document.createTextNode('Remove product'))
  removeButton.setAttribute("class", "btn btn-danger btn-sm")

  newCardBody.appendChild(h5)
  newCardBody.appendChild(firstP)
  newCardBody.appendChild(secondP)
  newCardBody.appendChild(removeButton)
  newCard.appendChild(newCardBody)
  newCard.style.margin = "16px"

  productList.appendChild(newCard)
}

productForm.onsubmit = (e) => {
  e.preventDefault();
  let prodName = document.getElementById('productName').value.toLowerCase().trim()
  let prodPrice = document.getElementById('productPrice').value.toLowerCase().trim()
  let prodBrand = document.getElementById('productBrand').value.toLowerCase().trim()
  if(!prodName || !prodPrice) {
    addWarning("Product name and price can't be empty")
  }
  else{
      let url = `http://127.0.0.1:3000/create/?name=${prodName}&price=${prodPrice}&brand=${prodBrand}`
      let ajaxPromise = new Promise((resolve, reject) => {

        let ajaxRequest = new XMLHttpRequest()
        ajaxRequest.open("GET", url) //access Axios request
  
        // on request received
        ajaxRequest.onreadystatechange = function () {
          if(this.readyState == 4 && this.status == 200) { // 4 = DONE, 200 = OK
            resolve(this.responseText);
          } else if (this.readyState == 4 && this.status !== 200) {
            reject()
          }
        }
        ajaxRequest.send() // send request
      })
      
      ajaxPromise.then((response) => {
        addProduct(JSON.parse(response))
      }).catch(err =>  {
       console.log("ERROR", err)
      })
  }
};
  