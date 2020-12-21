const mongoose = require("mongoose");
const { Path } = require("path-parser");
const { URL } = require("url");
const { compact, uniqBy } = require("lodash");
const requireLogin = require("../middlewares/requireLogin");
const requireCredits = require("../middlewares/requireCredits");
const Mailer = require("../services/Mailer");
const surveyTemplate = require("../services/emailTemplates/surveyTemplate");

// create survey instance
const Survey = mongoose.model("surveys");

// user is logged in & have credits
// mayhave addtional routes in future
// after mail send, send survey to database
module.exports = (app) => {
  app.get("/api/surveys/thanks", (req, res) => {
    res.send("Thank you for your feedback!");
  });

  app.post("/api/surveys/webhooks", (req, res) => {
    const allEvents = req.body.map(({ url, email }) => {
      const pathName = new URL(url).pathname;
      const p = new Path("/api/surveys/:surveyId/:choice");
      const match = p.test(pathName);
      if (match) {
        return { email, surveyId: match.surveyId, choice: match.choice };
      }
    });
    const compactEvents = compact(allEvents);
    const uniqEvents = uniqBy(compactEvents, "email", "surveyId");
    console.log(uniqEvents);
    res.send({});
  });
  app.post("/api/surveys", requireLogin, requireCredits, async (req, res) => {
    // pull the properties
    const { title, subject, body, recipients } = req.body;

    const survey = new Survey({
      // title : title
      title,
      subject,
      body,
      // subdoc collection
      // email => {return {email : email}}
      // ()for shorten object
      recipients: recipients
        .split(",")
        .map((email) => ({ email: email.trim() })),
      _user: req.user.id,
      dateSent: Date.now(),
      // extra url to add if user want to redirect to that link
    });

    // Great place to send an email
    // survey contains the subject and recipients
    // the second is the body of the email
    const mailer = new Mailer(survey, surveyTemplate(survey));
    try {
      await mailer.send();
      // save survey to database
      await survey.save();
      req.user.credits -= 1;
      const user = await req.user.save();
      // sendback update user model
      res.send(user);
    } catch (err) {
      res.status(422).send(err);
    }
  });
};
