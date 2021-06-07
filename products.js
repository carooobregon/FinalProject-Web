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
  alert('Product added successfully! You are being redirected.')
  window.location.replace('http://127.0.0.1:3000/admin');
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
  