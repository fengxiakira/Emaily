const express = require("express");
const keys = require("./config/key");
const mongoose = require("mongoose");
// set up passport for authentication
const cookieSessions = require("cookie-session");
// passport to track user login statuses
const passport = require("passport");
// express middleware
const bodyParser = require("body-parser");

// models(collection in MongoDB)
require("./models/user");
require("./models/Survey");
// passport.js haven't any output,不需要赋给const
require("./services/passport");

// connect to mongodb
mongoose.connect(keys.mongoURI);
// create express app
const app = express();

// app.use wrap middleware
// Returns middleware that only parses json and only looks at requests
// the billingRoutes req is
app.use(bodyParser.json());

// implement authentication flow by enabling cookies inside of our application
// app.use wrap middleware. middleware is prcessing to request
app.use(
  cookieSessions(
    // configuration object
    {
      // cookie last 30 days
      maxAge: 30 * 24 * 60 * 60 * 1000,
      // key to encrypt cookie
      keys: [keys.cookieKey],
    }
  )
);

// tell passport to use cookies,Start up express for this request lifecycle
app.use(passport.initialize());
// Kick this person into the oauth flow.  When they're done, save info to their 'session' that indicates we know who they are
app.use(passport.session());

// attach require 内的function to app,也就是express()
require("./routes/authRoute")(app);
require("./routes/billingRoutes")(app);
require("./routes/surveyRoutes")(app);

// configuration for Express in produ
if (process.env.NODE_ENV === "production") {
  // Express will serve up production assets
  // like our main.js file, or main.css file!

  const path = require("path");

  app.use(express.static(path.resolve(__dirname, "../client/build")));

  // Express will serve up the index.html file
  // if it doesn't recognize the route
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
  });
}

// node that it wants to listen for incoming traffic on port 5000
// app.listen(5000);

// dynamically figure out the port listend to
// capitalized is not changed
// figure 当前heroku 运行该app的port，process.env underlying environment
// 5000 is a default port on virtual machine
const PORT = process.env.PORT || 5000;
app.listen(PORT);
// localhost:5000
