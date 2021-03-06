// SurveyFormReview show users their form inputs for review
import React from "react";
import { connect } from "react-redux";
import formFields from "../constant/formFields";
import { withRouter } from "react-router-dom";
import * as actions from "../../actions";

// prop receive from surveynew
// submitSurvey as a prop to SurveyReview
const SurveyReview = ({ onCancel, formValues, submitSurvey, history }) => {
  const reviewFields = formFields.map(({ name, label }) => {
    return (
      <div key={name}>
        <label>{label}</label>
        <div>{formValues[name]}</div>
      </div>
    );
  });

  // l29 delay the execution
  return (
    <div>
      <h5>Here is the survey review</h5>
      {reviewFields}
      <button className="yellow darken-3 btn-flat" onClick={onCancel}>
        Back
      </button>
      <button
        className="green white-text darken-3 btn-flat right"
        onClick={() => submitSurvey(formValues, history)}
      >
        Send Survey
        <i className="material-icons right">email</i>
      </button>
    </div>
  );
};

function mapStateToProps(state) {
  return { formValues: state.form.surveyForm.values };
}

export default connect(mapStateToProps, actions)(withRouter(SurveyReview));
