let signUpForm = document.getElementById("signUpForm")
let totalPrice = 0


// todo hashear password y ver avatar
signUpForm.onsubmit = (e) => {
    e.preventDefault();
    // let avatar = document.getElementById('avatar').value
    let userName = document.getElementById('userName').value.trim()
    let userEmail = document.getElementById('email').value.toLowerCase().trim()
    let userPassword = document.getElementById('password').value.toLowerCase().trim()
    if(!userEmail || !userName || !userPassword) {
      console.log("Fields can't be empty")
    }
    else{
      axios.put( 
        'http://127.0.0.1:3000/createUser', 
        {
            username: userName,
            email: userEmail,
            password: userPassword
        }
      )
      .then(response => {
          console.log(response);
          alert(`added new user`);
          window.location.replace('http://127.0.0.1:3000/products');
      })
      .catch(error => {
          console.log(error.response.data)
          alert(`Problem when adding new user ${error.response.data}`);
      });
    }
  };