// root file
// import express, require to get access to express library
// deployment target https://git.heroku.com/still-castle-71616.git
const express = require("express");
const keys = require("./config/key");
const mongoose = require("mongoose");
// set up passport for authentication
const cookieSessions = require("cookie-session");
// passport to track user login statuses
const passport = require("passport");


// models(collection in MongoDB)
require('./models/user');
// passport.js haven't any output,不需要赋给const
require('./services/passport');

// connect to mongodb
mongoose.connect(keys.mongoURI);
// create express app
const app = express();

// implement authentication flow by enabling cookies inside of our application
// app.use wrap middleware. middleware is prcessing to request 
app.use(
    cookieSessions(
        // configuration object
        {
            // cookie last 30 days
            maxAge: 30 * 24 * 60 * 60 * 1000,
            // key to encrypt cookie
            keys: [keys.cookieKey]
        }
    )
);

// tell passport to use cookies
app.use(passport.initialize());
app.use(passport.session());

// attach require 内的function to app,也就是express()
require('./routes/authRoute')(app);


// node that it wants to listen for incoming traffic on port 5000
// app.listen(5000);

// dynamically figure out the port listend to
// capitalized is not changed
// figure 当前heroku 运行该app的port，process.env underlying environment
// 5000 is a default port on virtual machine
const PORT = process.env.PORT || 5000;
app.listen(PORT);
// localhost:5000
