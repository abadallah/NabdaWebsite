const express = require('express');
const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");
const routes = express.Router();


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://nabdawebapp-default-rtdb.firebaseio.com",
});

routes.get("/patientList", function (req, res) {
    const sessionCookie = req.cookies.session || "";
  
    admin
      .auth()
      .verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then(() => {
        res.render("patientList.html");
      })
      .catch((error) => {
        res.redirect("/login");
      });
  });
  


  routes.post("/sessionLogin", (req, res) => {
    const idToken = req.body.idToken.toString();
  
    const expiresIn = 60 * 60 * 24 * 2 * 1000;
  
    admin
      .auth()
      .createSessionCookie(idToken, { expiresIn })
      .then(
        (sessionCookie) => {
          const options = { maxAge: expiresIn, httpOnly: true };
          res.cookie("session", sessionCookie, options);
          res.end(JSON.stringify({ status: "success" }));
        },
        (error) => {
          res.status(401).send("UNAUTHORIZED REQUEST!");
        }
      );
  });
  

  routes.get("/sessionLogout", (req, res) => {
    res.clearCookie("session");
    res.redirect("/login");
  });
  

  
  routes.get("/profile", function (req, res) {
    const sessionCookie = req.cookies.session || "";
  
    admin
      .auth()
      .verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then(() => {
        res.render("profile.html");
      })
      .catch((error) => {
        res.redirect("/login");
      });
    // res.render("profile.html");
  });


  //rest of the 
  routes.get("/contactUs",  (req, res) =>{ // no 
    const sessionCookie = req.cookies.session || "";
  
    admin
      .auth()
      .verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then(() => {
        res.render("contactUs.html");
      })
      .catch((error) => {
        res.redirect("/login");
      });
  
  });
  


  routes.get("/patientList/:id", function (req, res) {
    const sessionCookie = req.cookies.session || "";
  
    admin
      .auth()
      .verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then(() => {
        console.log(sessionCookie);
        res.render("viewPatient.html");
  
      })
      .catch((error) => {
        res.redirect("/login");
      });
    // res.render("viewPatient.html");
  });
  


  routes.get("/patientList/patient/ctScan", function (req, res) {
    const sessionCookie = req.cookies.session || "";
  
    admin
      .auth()
      .verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then(() => {
        res.render("ctScan.html");
      })
      .catch((error) => {
        res.redirect("/login");
      });
    // res.render("ctScan.html");
  });


  routes.get("/patientList/patient/medicine", function (req, res) {
    const sessionCookie = req.cookies.session || "";
  
    admin
      .auth()
      .verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then(() => {
        res.render("medicine.html");
      })
      .catch((error) => {
        res.redirect("/login");
      });
    res.render("medicine.html");
  });



  routes.get("/patientList/patient/doctorDiagnosis", function (req, res) {
    const sessionCookie = req.cookies.session || "";
  
    admin
      .auth()
      .verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then(() => {
        res.render("doctorDiagnosis.html");
      })
      .catch((error) => {
        res.redirect("/login");
      });
    res.render("doctorDiagnosis.html");
  
  });



  routes.get("/patientList/patient/ecgResult", function (req, res) {
    const sessionCookie = req.cookies.session || "";
  
    admin
      .auth()
      .verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then(() => {
        res.render("ecgResult.html");
      })
      .catch((error) => {
        res.redirect("/login");
      });
    res.render("ecgResult.html");
  });



  routes.get("/patientList/patient/medicalTest", function (req, res) {
    const sessionCookie = req.cookies.session || "";
  
    admin
      .auth()
      .verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then(() => {
        res.render("medicalTest.html");
      })
      .catch((error) => {
        res.redirect("/login");
      });
    res.render("medicalTest.html");
  });
  
  
  
  routes.get("/patientList/patient/CTScann/:FilName", function (req, res) {
    const sessionCookie = req.cookies.session || "";
    var FilName = request.params.FilName;

    admin
      .auth()
      .verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then(() => {
        res.render("medicalTest.html");
      })
      .catch((error) => {
        res.redirect("/login");
      });
      res.render("ecgResult.html");

  
    //res.render("medicalTest.html");
  });
  

  


  module.exports = routes;
