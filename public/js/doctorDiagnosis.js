var firebaseConfig = {
    apiKey: "AIzaSyAjI9w1Nyj6QCFhmTOdSYN8SitzTb96pJ0",
    authDomain: "nabdawebapp.firebaseapp.com",
    databaseURL: "https://nabdawebapp-default-rtdb.firebaseio.com",
    projectId: "nabdawebapp",
    storageBucket: "nabdawebapp.appspot.com",
    messagingSenderId: "583448274380",
    appId: "1:583448274380:web:9a9a75834b599ab2bd6969"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);


  const patientId = localStorage.getItem("patientId");
  const loginMail = localStorage.getItem("email");
window.addEventListener("DOMContentLoaded", ()=>{
    
/*********************************************************** DataTable  **************************************************************/

    var table = $('#myTable').DataTable({
        //delete ordering table
        ordering:false,
        //delete dynamic entries and make it static
        dom: 'rtip',
        pageLength: 10,
        order: [[ 0, "desc" ]]
        
        });
        // reAd the search 
        $('#search').keyup( function() {
        table.search($('#search').val()).draw();
        } );
    
        $('#myTable tbody tr').hover(function() {
            $(this).css('cursor','pointer');
        });

        /************************************************************ get Medicine  *******************************************************/
        firebase.firestore().collection(`accounts/${loginMail}/users/${patientId}/patientData/doctorDiagnosis/diagnosis`).get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.exists){
                    let json = doc.data();
                    let newSymptoms = json["newSymptoms"];
                    let newDiagnosis = json["newDiagnosis"];
                    let date = json["date"];
                    let DoctorName = json["DoctorName"];
                    
                    console.log("newSymptoms -->",newSymptoms);
                    console.log("newDiagnosis -->",newDiagnosis);
                    console.log("date -->",date);
                    console.log("name -->",DoctorName);         
              
                    var dataSet = [`<img src="/img/viewPatient/doctor.jpg" class="img-fluid rounded-circle" alt="doctorImg" id="doctorImg">` ,
                    DoctorName, date,`<button class="btn btn-sm btn-outline-info ml-4 px-3 rounded text-center"type="submit" data-toggle="modal" data-id="1" data-target="#viewDiagnosis"
                    onclick= "getModalData(${DoctorName},${date},${newSymptoms},${newDiagnosis})"
                    >View</button>`];

                table.row.add(dataSet).draw();
                }
                else {
                    console.log("doc not exists");
                }
            });
        })
        .catch((error) => {
            console.error(error);
        });
        function getModalData (DoctorName,date,newSymptoms,newDiagnosis){
            alert("called");
            console.log(DoctorName,date,newSymptoms,newDiagnosis);

        }

        /*********************************************************** sideBar  **************************************************************/

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
            
            event.preventDefault();
            if (!form.checkValidity()) {
                event.stopPropagation();
                console.log("not valid");
                
            }
            else {
                console.log("valid");
               
                const newSymptoms = event.target.newSymptoms.value;
                const newDiagnosis = event.target.newDiagnosis.value;
                
                addNewDiagnosis(newSymptoms,newDiagnosis,patientId,loginMail);
                
            }
        form.classList.add('was-validated')

    }, false)
})
})()

/******************************************************* add a New Medicine  **********************************************************/

function addNewDiagnosis(newSymptoms,newDiagnosis,patientId,loginMail){
    //get date
    var today = new Date();
    var date = today.getFullYear()+' / '+(today.getMonth()+1)+' / '+today.getDate();
    //get doctor's name
    const DoctorName = localStorage.getItem("name");
    var data = {"newSymptoms":newSymptoms,"newDiagnosis":newDiagnosis,"date":date,"DoctorName":DoctorName};
    firebase.firestore().collection(`accounts/${loginMail}/users/${patientId}/patientData/doctorDiagnosis/diagnosis`).add(data)
    .then(() => {
        console.log("Diagnosis inserted successfully !");
        
        Swal.fire({
            position: 'top-middle',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
          }).then(()=>{
            window.location.reload();
        })
        
    })   
    .catch((error) => {
        console.error("Error writing document: ", error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'some thing went wrong !',
            showConfirmButton: false,
            timer: 1000
        })
    });
}