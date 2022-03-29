async function signupFormHandler(event){
    event.preventDefault();

    /* We need to POST the username, email, and password 
    from the form to our server, so go ahead and grab the data 
    from the form. */
    const username = document.querySelector('#username-signup').value.trim();
    const email = document.querySelector('#email-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();

    /* Once we have the username, email, and password, make a 
    fetch() POST request to the /api/users/ endpoint. */
    //make sure all fields have values
    if(username && email && password){
        const response = await fetch('/api/users', {
            method: 'post',
            body: JSON.stringify({
                username,
                email,
                password
            }),
            headers: { 'Content-Type': 'application/json' }
        })
        
        // check the response status
        if(response.ok) {
            console.log(`Success! User ${username} has been created successfully!`);
        } else {
            alert(response.statusText);
        }
    }

}


async function loginFormHandler(event) {
    event.preventDefault();
    /* We need to POST the email, and password from the
    form to our server, so go ahead and grab the data 
    from the form. */  
    const email = document.querySelector('#email-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();
      /* Once we have the email and password, make a 
    fetch() POST request to the /api/users/logins */
    //make sure all fields have values
    if (email && password) {
      const response = await fetch('/api/users/login', {
        method: 'post',
        body: JSON.stringify({
          email,
          password
        }),
        headers: { 'Content-Type': 'application/json' }
      });
  
      if (response.ok) {
        document.location.replace('/');
      } else {
        alert(response.statusText);
      }
    }
}
  
  
document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);
document.querySelector('.login-form').addEventListener('submit', loginFormHandler);