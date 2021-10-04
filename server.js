'use strict';

// Bring in our dependencies
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const bodyParser = require("body-parser");
const express = require("express");
const favicon = require('serve-favicon');
const config = require('./config');
const router = require('./routes/authRoutes.js');
const csrfMiddleware = csrf({ cookie: true });


const app = express();
const path = require('path');

app.use(cookieParser());
app.use(csrfMiddleware);
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/public')))
app.use(favicon(path.join(__dirname,'public','img','favicon.ico')));
app.engine("html", require("ejs").renderFile);
app.use('/', router);


app.listen(config.port, () => console.log('App is listening on url http://localhost:' + config.port));

