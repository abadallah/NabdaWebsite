const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');


window.addEventListener("DOMContentLoaded", () => {
	const firebaseConfig = {
	  	apiKey: "AIzaSyAjI9w1Nyj6QCFhmTOdSYN8SitzTb96pJ0",
		authDomain: "nabdawebapp.firebaseapp.com",
		databaseURL: "https://nabdawebapp-default-rtdb.firebaseio.com",
		projectId: "nabdawebapp",
		storageBucket: "nabdawebapp.appspot.com",
		messagingSenderId: "583448274380",
		appId: "1:583448274380:web:9a9a75834b599ab2bd6969",
	};

	firebase.initializeApp(firebaseConfig);

	firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
	// firebase.auth().useDeviceLanguage();

	/*********************************************************** log in **********************************************************/

	document
	  .getElementById("login")
	  .addEventListener("submit", (event) => {
		event.preventDefault();
		 	const login = event.target.logInMail.value;
			localStorage.setItem("email",login);
			const password = event.target.logInPass.value;
			
		firebase
		  .auth()
		  .signInWithEmailAndPassword(login, password)
		  .then(({ user }) => {
			  // handle cookies
			  return user.getIdToken().then((idToken) => {
				  return fetch("/sessionLogin", {
					  method: "POST",
					  headers: {
						  Accept: "application/json",
						  "Content-Type": "application/json",
						  "CSRF-Token": Cookies.get("XSRF-TOKEN"),
						},
						body: JSON.stringify({ idToken }),
					});
				});			
		  })
		  .then(() => {
			return firebase.auth().signOut();
		  })
		  .then(() => {
			firebase.firestore().collection(`accounts`).doc(login).get()
			.then((doc) => {
				if (doc.exists) {
					console.log("Document data:", doc.data());
				
					localStorage.setItem("name",doc.data().name);
				} else {
				
					console.log("No such document!");
				}
			}).catch((error) => {
				console.log("Error getting userName:", error);
			});
			  // pop up sweetAlert "sign in successfully"
			const Toast = Swal.mixin({
				toast: true,
				position: 'top-end',
				showConfirmButton: false,
				timer: 1000,
				timerProgressBar: true,
				didOpen: (toast) => {
				  toast.addEventListener('mouseenter', Swal.stopTimer)
				  toast.addEventListener('mouseleave', Swal.resumeTimer)
				}
			  })
			  Toast.fire({
				icon: 'success',
				title: 'Signed in successfully'
			  }).then(()=>{
			
				//redirect to the main page
			  window.location.assign("/patientList");
			})
			
		  });
		  
		return false;
	  });
  });
/*********************************************************** sign up **********************************************************/
  document
	.getElementById("signup")
	.addEventListener("submit", (event) => {
		event.preventDefault();
		//get sign up data 
		const signup = event.target.signUpMail.value;
		const password = event.target.signUpPass.value;
		const userName = event.target.signUpName.value;
		const phoneNum = event.target.signUpNum.value;
		const doctorRole = document.querySelector('input[name="SignRole"]:checked').value;
		// get the cv document ready to upload into storage
		const ref = firebase.storage().ref(`CVs/${signup}`);
		const file = document.querySelector("#fileUpload").files[0];
		const name = +new Date() + "-" + file.name;
		const metadata = {
		contentType: file.type
		};
		// apload the cv document into storage
		const task = ref.child(name).put(file, metadata);
		//get the URL and save it into FireStore with the rest of data
	 	 task
		.then(snapshot => snapshot.ref.getDownloadURL())
		.then(url => {
		  firebase.firestore().collection('accounts').doc(signup).set({
			name: userName,
			email : signup,
			phoneNumber : phoneNum,
			role : doctorRole,
			status:"pending",
			CVURL : url
		  })
		 
		  console.log("data is sent successfully");
		}).then(()=>{
			Swal.fire({
				position: 'top-middle',
				icon: 'success',
				// title: 'sig successfully',
				title:'your CV is under review, please wait a couple of min :D',
				showConfirmButton: false,
				timer: 2500
			  })
		})
		.then(()=>{
			firebase.firestore().collection('accounts').doc(signup).onSnapshot((doc) => {
				if(doc.data().status !="pending"){
					CreateAcc();
				}
			});
		})
		.catch(error => {
			console.error("Error while uploading data intp fireStore ",error);
		})
	

		// create new acc
		const CreateAcc = () => {

			firebase
			  .auth()
			  .createUserWithEmailAndPassword(signup, password)
			  
			  .then(({ user }) => {
				  // store profile data
				return user.getIdToken().then((idToken) => {
				  // add cookies
				  return fetch("/sessionLogin", {
					method: "POST",
					headers: {
					  Accept: "application/json",
					  "Content-Type": "application/json",
					  "CSRF-Token": Cookies.get("XSRF-TOKEN"),
					},
					body: JSON.stringify({ idToken }),
				  });
				});
	  
			  }) 
			  // send verfication mail
			  .then(() => {
				  console.log('Signed Up Successfully !');
				  event.preventDefault();
					// pop up sweetAlert
				  Swal.fire({
					  icon: 'success',
					  title: 'Registeration done',
					  text: 'please wait for our confirmation',
					  showConfirmButton: false,
					})
					//check user Mail and notify him (Accepted)
				  sendVerificationEmail();
			  })
			  // logOut from fireBase 
			  .then(() => {
				return firebase.auth().signOut();
			  })
			  // redirect to login page
			  .then(() => {
				window.location.assign("/login");
			  });
			return false;

		}
		
	});


	const sendVerificationEmail = () => {
		//Built in firebase function responsible for sending the verification email
		firebase.auth().currentUser.sendEmailVerification()
		.then(() => {
			console.log('Verification Email was Sent Successfully !');
		})
		.catch(error => {
			console.error(error);
		})
	}


	  