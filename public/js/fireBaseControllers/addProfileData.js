/************************************************************ fireBase Configerations ************************************************************/

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

var secondaryAppConfig = {
    apiKey: "AIzaSyAS3f6V8n4-puT644U3tmFZGBMX5ul63aU",
    projectId: "graduationproj-5413d",
    appId: "1:214313502173:web:995037a15b001db48ca234",
    };
var secondaryApp =  firebase.initializeApp(secondaryAppConfig, "secondary");

/***************************************************************** OnLoad Event *****************************************************************/

window.addEventListener("load", ()=> { 


    const Name = document.getElementById("userName");   
    const phoneNum = document.getElementById("phoneNum");   
    const email = document.getElementById("email");
    const loginMail = localStorage.getItem("email");

    firebase.firestore().collection('accounts').doc(loginMail).get()
    .then( doc =>{
        if (doc.exists){
            Name.value = doc.data().name ;
        
            phoneNum.value = doc.data().phoneNumber;
            email.value = doc.data().email;
        }
        else {
            console.log("doc not exists");
        }
    })
    .catch(err => {
        console.log("error",err);
    });



    // 
    secondaryApp.firestore().collection(`dataOfProfile`).get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log("here we go");
                if (doc.exists){
                    console.log("--->",doc.data());
                    test.innerHTML= doc.data().Age;
    
                }
                else {
                    console.log("doc not exists");
                }
            });
        })








});