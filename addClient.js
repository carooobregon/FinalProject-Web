let signUpForm = document.getElementById("signUpForm")
let totalPrice = 0

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
    console.log("Fields can't be empty")
  }
  else{
    axios.post( 
      'http://127.0.0.1:3000/createUser', formData
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