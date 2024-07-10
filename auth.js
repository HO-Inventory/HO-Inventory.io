document.getElementById("loginForm").addEventListener("submit",(event)=>{
    event.preventDefault()
})

// firebase.auth().onAuthStateChanged((user)=>{
    
//     if(user){
//         alert('user' + user);
//         location.replace("welcome.html");
//     }
// })


function login(){
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    // firebase.auth().signInWithEmailAndPassword(email, password)
    // .catch((error)=>{
    //     document.getElementById("error").innerHTML = error.message
    // })

    firebase.auth().signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    var user = userCredential.user;
    if(user){

        alert('Welcome to HO Inventory');
        // Swal.fire({
        //     icon: 'success',
        //     title: 'Login Successfully',
        //     showConfirmButton: false,
        //     timer: 1500
        // });
        location.replace("dashboard.html");
    }else{
    }
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
  });
}

function forgotPass(){
    const email = document.getElementById("email").value
    firebase.auth().sendPasswordResetEmail(email)
    .then(() => {
        alert("Reset link sent to your email id")
    })
    .catch((error) => {
        document.getElementById("error").innerHTML = error.message
    });
}

function logout(){
    alert('Signout Success!!')
    firebase.auth().signOut()
    location.replace("index.html");
}


