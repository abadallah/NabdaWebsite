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



window.addEventListener("DOMContentLoaded", ()=>{
    const patientId = localStorage.getItem("patientId");
    const loginMail = localStorage.getItem("email");
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

        /****************************************************** get Medicine  *******************************************************/
        firebase.firestore().collection(`accounts/${loginMail}/users/${patientId}/patientData/medicineAdded/medicines`).get()
        .then((querySnapshot) => {
         
            querySnapshot.forEach((doc) => {
                if (doc.exists){
                    let json = doc.data();
                    let medicineName = json["medicineName"];
                    let duration = json["duration"];
                    
                    
                    let timeOfAddMedicine = json["timeOfAddMedicine"];
                    let date = new Date(timeOfAddMedicine*1000)
                    let realDate = date.getDate()+" / "+(date.getMonth()+1)+" / "+date.getFullYear();

                    console.log("duration -->",duration);
                    console.log("medicineName -->",medicineName);
                    
                    if(doc.data().imageType){

                        var imgType = doc.data().imageType;

                        let newImageSrc=`/img/viewPatient/medicine/${imgType}.svg`; 
                        var dataSet = [`<img src=${newImageSrc} class="img-fluid w-25 m-2" alt="medicineImg">` ,
                        medicineName, duration, realDate];
                    }
                    else{
                        var dataSet = [' <img src="/img/viewPatient/document.svg" class="img-fluid " alt="medicineImg">' ,
                        medicineName, duration, realDate];
                    }

                
                table.row.add(dataSet).draw();
                }
                else {
                    console.log("doc not exists");
                }
            });
        }).catch((error) => {
            console.error(error);
          });

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
    const patientId = localStorage.getItem("patientId");
    const loginMail = localStorage.getItem("email");
    var forms = document.querySelectorAll('.medicine-validation')
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
                const medicineName = event.target.medicineName.value;
                const medicineDuration = event.target.medicineDuration.value;
                const medicineFrequency = event.target.medicineFrequency.value;
                const medicineType = document.querySelector('input[name="MedicineType"]:checked').value;
                
                addNewMedicine(medicineName,medicineDuration,medicineFrequency,medicineType,patientId,loginMail);
            }
        form.classList.add('was-validated')

    }, false)
})
})()

/******************************************************* add a New Medicine  **********************************************************/


function addNewMedicine(medicineName,medicineDuration,medicineFrequency,medicineType,patientId,loginMail){

    var date = new Date().getTime() /1000;
    
    var data = {"medicineName":medicineName,"duration":medicineDuration,"imageType":medicineType,"medicineFrequency":medicineFrequency,"timeOfAddMedicine":date};
    firebase.firestore().collection(`accounts/${loginMail}/users/${patientId}/patientData/medicineAdded/medicines`).add(data)
    .then(() => {
        console.log("Medicine inserted successfully !");
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
            timer: 1500
        })
    });
}
