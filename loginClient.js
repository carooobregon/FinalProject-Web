// On submit form verify empty inputs and user email
const loginForm = document.getElementById("loginForm")
loginForm.onsubmit = (e) => {
  e.preventDefault(); 
  let userEmail =  document.getElementById('email').value.trim();
  let password = document.getElementById('password').value.trim();

  if (userEmail === '') { alert('Type your username'); return; }
  if (password ==='') { alert('Type your password'); return; }
  axios.post( 
    'http://127.0.0.1:3000/login', 
    {
      userEmail: userEmail,
      password: password
    }
  )
  .then(() => {      
    alert(`Correct login, you are being redirected to the shopping cart`);
    window.location.replace('http://127.0.0.1:3000/');
  })
  .catch((error) => {
    alert(`Error: ${error.response.data}`);
  });
}

// If user doesn't have an account redirect him to signUp view
const btnCreateAccount = document.getElementById('createAccount');
btnCreateAccount.addEventListener("click", (e) => {
  window.location.replace(`http://127.0.0.1:3000/signup`)
});

