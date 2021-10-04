/*********************************************************** fireBase Configerations ************************************************************/

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


const secondaryAppConfig = {
    apiKey: "AIzaSyAS3f6V8n4-puT644U3tmFZGBMX5ul63aU",
    projectId: "graduationproj-5413d",
    appId: "1:214313502173:web:995037a15b001db48ca234",
    };
var patientApp =  firebase.initializeApp(secondaryAppConfig, "secondary");  
const patientdb = patientApp.database();

/*************************************************************** Manage DataTable ***************************************************************/

    $(document).ready(function() {
    const loginMail = localStorage.getItem("email");

    const table = $("#myTable").DataTable( {
        //delete ordering table
        ordering:false,
        //delete dynamic entries and make it static
        dom: 'rtip',
        pageLength: 10,
        "columnDefs": [ {
            "targets": -1,
            "data": null,
            "defaultContent": '<button class="btn btn-sm btn-outline-info ml-4 px-3 rounded text-center"type="submit">View</button>'
        },{
            "targets": [1],
            "className": 'font-weight-bold'
        } ],
    } );
    // manage searching
    $('#search').keyup( function() {
    table.search($('#search').val()).draw();
    } );

/************************************************************** Manage Patient List **************************************************************/

    firebase.firestore().collection(`accounts/${loginMail}/users`).get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if (doc.exists){
 
                const Name = doc.data().fullName ;    
                const email = doc.data().email;
                const id = doc.id;
              

                if(doc.data().profileImage){
                    var patientImg = doc.data().profileImage;
                    var dataSet = [` <img src="${patientImg}" class="img-fluid rounded-circle" alt="patientImg" id="patientImg">`, id, Name, email];  
                }
                else{
                    var dataSet = [' <img src="/img/viewPatient/profile.png" class="img-fluid rounded-circle" alt="patientImg" id="patientImg">' ,
                    id, Name, email];
                }
                table.row.add(dataSet).draw();
            }
            else {
                console.log("doc not exists");
            }
        });
    })

    /************************************************************* manage route  *****************************************************************/

    $('#myTable').on( 'click', 'tbody tr', function () {
        const currentRow = $(this).closest('tr').find( 'td:eq(2)' ).text();
        const patientId = $(this).closest('tr').find( 'td:eq(1)' ).text();

        localStorage.setItem("patientId",patientId);
        
        window.location.href = `/patientList/${currentRow}`;

    } );



    /**************************************************************** side bar *******************************************************************/
    $('.dismiss, .overlay').on('click', function() {
        $('.sidebar').removeClass('active');
        $('.overlay').removeClass('active');
    });

    $('.open-menu').on('click', function(e) {
        e.preventDefault();
        $('.sidebar').addClass('active');
        $('.overlay').addClass('active');
        // close opened sub-menus
        $('.collapse.show').toggleClass('show');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    });
});


/*********************************************************** Form Modal validation  **************************************************************/

(function () {
    'use strict'
    var forms = document.querySelectorAll('.needs-validation')
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
        form.addEventListener('submit', function (event) {
            const newPatientId = event.target.newPatientNationalId.value ; 
            event.preventDefault();
            if (!form.checkValidity()) {
                event.stopPropagation();
                console.log("not valid");
                
            }
            else {
                console.log("valid");
                getPatientData(newPatientId);
            }
        form.classList.add('was-validated')

    }, false)
})
})()

/*************************************************************** getNewPatientData ***************************************************************/
 


function getPatientData (newPatientId){
//check realTime DataBase for existing
    const loginMail = localStorage.getItem("email");  
    patientdb.ref("users").get().then((snapshot) => {
      if (snapshot.exists()) {
        let found = false ;
        for (var key in snapshot.val()){
            if (snapshot.val()[key]["idNumber"] == newPatientId){
                console.log("found");
                const patientData = snapshot.val()[key]; 
                console.log(snapshot.val()[key]);
                const patientEmail = snapshot.val()[key]["email"];
                console.log("patientEmail  ->",patientEmail);
                setPatientData(loginMail, newPatientId, patientData);
                getProfileData(patientEmail,loginMail,newPatientId);
                getdataInNutritionCellData(patientEmail,loginMail,newPatientId);
                getmedicineAddedData(patientEmail,loginMail,newPatientId);
                getnotesWrittenData(patientEmail,loginMail,newPatientId);
                getnumberOfStepsData(patientEmail,loginMail,newPatientId);
                found = true ;
                break;
            }
        }
        if (!found)  {
            console.log("patient not found");
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'this document not exists !',
                showConfirmButton: false,
                timer: 1500
            })
            document.getElementById("newPatientNationalId").focus();
        }
      } 
      else {
        console.log("No data available on firebase");
      }
    }).catch((error) => {
      console.error(error);
    });
}


/*************************************************************** setNewPatientData ***************************************************************/

function setPatientData (doctorId, patientId, patientDoc){
    firebase.firestore().collection(`accounts/${doctorId}/users`).doc(patientId).set(patientDoc)
    .then(() => {
        console.log("Document successfully written!");
        // add sweetAlert in case of success
        Swal.fire({
            position: 'top-middle',
            icon: 'success',
            title: 'patient has been added successfully',
            showConfirmButton: false,
            timer: 1500
          })
          .then( ()=>{ // reload the table 
                window.location.reload();
          });
    })   
    .catch((error) => {
        console.error("Error writing document: ", error);
    });
}
/*************************************************************** getProfileData ***************************************************************/

//get the data from patient's DB
function getProfileData(patientEmail, doctorId, patientId){

patientApp.firestore().collection("dataOfProfile").get()
    .then((querySnapshot) => {
   

        querySnapshot.forEach((doc) => {
            if (doc.exists){
                console.log("rest of data are exists");
                let json = doc.data();
                console.log("sender =",json["Sender"]);
                console.log("email of sender =",patientEmail);

                if (json["Sender"] ==  patientEmail){
                    console.log("found");
                    console.log(json["Sender"]);
                    console.log(json);
                    setProfileData(doctorId, patientId, json);
                } 
                
                
            }
            else {
                console.log("doc not exists");
            }
        });
    }).catch((error) => {
        console.error(error);
      });
}

function setProfileData  (doctorId, patientId, patientDoc) {
    firebase.firestore().collection(`accounts/${doctorId}/users/`).doc(patientId).set(patientDoc,{  merge: true }) 
    .then(() => {
        console.log("data inserted successfully !");
        
    })   
    .catch((error) => {
        console.error("Error writing document: ", error);
    });
}
/*************************************************************** getdataInNutritionCellData ***************************************************************/

//get the data from patient's DB
function getdataInNutritionCellData(patientEmail, doctorId, patientId){
 
    patientApp.firestore().collection("dataInNutritionCell").get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.exists){
                    let json = doc.data();
                    if (json["emailOfNutritionSender"] ==  patientEmail){
                        console.log("found");
                        setdataInNutritionCellData(doctorId, patientId, json);
                    }
                 
                    
                }
                else {
                    console.log("doc not exists");
                }
            });
        }).catch((error) => {
            console.error(error);
          });
    }
    
    function setdataInNutritionCellData  (doctorId, patientId, patientDoc) {
        firebase.firestore().collection(`accounts/${doctorId}/users/${patientId}/patientData/dataInNutritionCell/nutritions`).add(patientDoc) 
        .then(() => {
            console.log("data inserted successfully !");
            
        })   
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
    }

    /*************************************************************** getmedicineAddedData ***************************************************************/

//get the data from patient's DB
function getmedicineAddedData(patientEmail, doctorId, patientId){
 
    patientApp.firestore().collection("medicineAdded").get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.exists){
                    let json = doc.data();
                    if (json["emailOfSender"] ==  patientEmail){
                        console.log("found");
                        setmedicineAddedData(doctorId, patientId, json);
                    }
                }
                else {
                    console.log("doc not exists");
                }
            });
        }).catch((error) => {
            console.error(error);
          });
    }
    
    function setmedicineAddedData  (doctorId, patientId, patientDoc) {
        firebase.firestore().collection(`accounts/${doctorId}/users/${patientId}/patientData/medicineAdded/medicines`).add(patientDoc) 
        .then(() => {
            console.log("data inserted successfully !");
            
        })   
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
    }

        /*************************************************************** getnotesWrittenData ***************************************************************/

//get the data from patient's DB
function getnotesWrittenData(patientEmail, doctorId, patientId){
 
    patientApp.firestore().collection("notesWritten").get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.exists){
                    let json = doc.data();
                    if (json["emailOfSender"] ==  patientEmail){
                        console.log("found");
                        setnotesWrittenData(doctorId, patientId, json);
                    }
                }
                else {
                    console.log("doc not exists");
                }
            });
        }).catch((error) => {
            console.error(error);
          });
    }
    
    function setnotesWrittenData  (doctorId, patientId, patientDoc) {
        firebase.firestore().collection(`accounts/${doctorId}/users/${patientId}/patientData/notesWritten/notes`).add(patientDoc) 
        .then(() => {
            console.log("data inserted successfully !");
            
        })   
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
    }
            /*************************************************************** getnumberOfStepsData ***************************************************************/

//get the data from patient's DB
function getnumberOfStepsData(patientEmail, doctorId, patientId){
 
    patientApp.firestore().collection("numberOfSteps").get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.exists){
                    let json = doc.data();
                    if (json["emailOfSender"] ==  patientEmail){
                        console.log("found");
                        setnumberOfStepsData(doctorId, patientId, json);
                    }
                }
                else {
                    console.log("doc not exists");
                }
            });
        }).catch((error) => {
            console.error(error);
          });
    }
    
    function setnumberOfStepsData  (doctorId, patientId, patientDoc) {
        firebase.firestore().collection(`accounts/${doctorId}/users/${patientId}/patientData/numberOfSteps/steps`).add(patientDoc) 
        .then(() => {
            console.log("data inserted successfully !");
            
        })   
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
    }