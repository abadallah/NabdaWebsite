const express = require('express');
const authRoutes = express.Router();
const routes = require('./router.js');

authRoutes.use('/', routes);

authRoutes.all("*", (req, res, next) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    next();
  });
  

  authRoutes.get("/login", function (req, res) {
    res.render("log.html");
  });
  

  authRoutes.get("/signup", function (req, res) {
    res.render("log.html");
  });

  authRoutes.get("/", function (req, res) {
    res.render("index.html");
  });
  
  module.exports = authRoutes;
  