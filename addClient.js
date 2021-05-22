let productForm = document.getElementById("signUpForm")
let totalPrice = 0


// todo hashear password y ver avatar
productForm.onsubmit = (e) => {
    e.preventDefault();
    // let avatar = document.getElementById('avatar').value
    let userName = document.getElementById('userName').value.trim()
    let userEmail = document.getElementById('email').value.toLowerCase().trim()
    let userPassword = document.getElementById('password').value.toLowerCase().trim()
    if(!userEmail || !userName || !userPassword) {
      addWarning("Fields can't be empty")
    }
    else{
        let url = `http://127.0.0.1:3000/createUser/?username=${userName}&email=${userEmail}&password=${userPassword}`
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
          console.log("USER CREATED", response)
        }).catch(err =>  {
         console.log("ERROR", err)
        })
    }
  };
    