
const productsTable = document.getElementById('productsTable');
const addButton = document.getElementById('btnAdd');

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

function populateTable(products){
  JSON.parse(products).forEach(product => { 
  let row = productsTable.insertRow(); 
  let cellName = row.insertCell();
  let cellPrice = row.insertCell();
  let cellBrand = row.insertCell();
  let cellEdit = row.insertCell();
  let cellDelete = row.insertCell();

  cellName.innerText = product.name;
  cellPrice.innerText = product.price;
  cellBrand.innerText = product.brand ? product.brand : 'none';

  buttonEdit = document.createElement('button');
  buttonEdit.appendChild(document.createTextNode('Edit'));
  buttonEdit.setAttribute("class", "btn btn-info btn-sm")
  //TODO: send to EDIT view
  buttonEdit.addEventListener('click', () => { window.location.replace(`http://127.0.0.1:3000/products/${product._id}/edit`) });
  cellEdit.appendChild(buttonEdit);

  buttonDelete = document.createElement('button');
  buttonDelete.appendChild(document.createTextNode('Delete'));
  buttonDelete.setAttribute("class", "btn btn-danger btn-sm")
  buttonDelete.addEventListener('click', (e) => {
    let productId = product._id;
    axios.delete(`http://127.0.0.1:3000/products/${productId}`)
    .then(response => {
      alert('Poduct deleted successfully');
      row.parentNode.removeChild(row);
    })
    .catch(error => {
      console.log(error.response);
      alert(`Problem when deleting the product info ${error.response}`);
    });
});
  cellDelete.appendChild(buttonDelete);
});
}

const deleteProduct = (product) => {
  let url = `http://127.0.0.1:3000/products/?name=${product}delete`
  let ajaxPromise = new Promise((resolve, reject) => {
    let ajaxRequest = new XMLHttpRequest()
    ajaxRequest.open("DELETE", url)
    ajaxRequest.onreadystatechange = function () {
      if(this.readyState == 4 && this.status == 200) {
        resolve();
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
}