let signUpForm = document.getElementById("signUpForm")
let totalPrice = 0

// On submit create user
signUpForm.onsubmit = (e) => {
  e.preventDefault();
  let name = document.getElementById('userName').value.trim()
  let email = document.getElementById('email').value.toLowerCase().trim()
  let password = document.getElementById('password').value.toLowerCase().trim()
  const avatarImage = document.getElementById('avatarImage');

  const formData = new FormData();
  formData.append('name', name);
  formData.append('email', email);
  formData.append('password', password);
  
  const files = avatarImage.files;
  formData.append('avatar', files[0])

  if(!email || !name || !password) {
    alert('All fields must be filled.');
  }
  else{ // Route to create user and then authenticate
    axios.post( 
      'http://127.0.0.1:3000/createUser', formData
    )
    .then(() => {
      alert('New account created! You are being redirect to authenticate.');
      window.location.replace('http://127.0.0.1:3000/login');
    })
    .catch(error => {
      console.log(error.response.data)
      alert(`Problem when adding new user ${error.response.data}`);
    });
  }
};