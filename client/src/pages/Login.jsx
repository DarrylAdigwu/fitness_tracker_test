import React from "react";
import { Form, NavLink, useActionData, useNavigate } from "react-router";
import "../assets/css/account.css";
import { sendData } from "../../client-utils";

export async function action({ request }) {
   // Form data
   const formData = await request.formData();
   const username = formData.get("username");
   const password = formData.get("password");

   // Send form data to server
   const sendFormData = await sendData("login", username, password);

   /**  Client side validation **/
  const errors = {};
  const valid = {};
  
  // Check input return error obj if invalid
  if(!username) {
    errors.invalidUsername = "Name is required!"
    return errors;
  }
  
  // All server side error validation responses
  if(sendFormData.serverError) {
    errors.invalid = sendFormData.serverError
    return errors.invalid
  }

  if(!password) {
    errors.invalidPassword = "Password is required!"
    return errors;
  }
 
  // If all valid, return valid object for page redirect
 if(username && password) {
   valid.success = "true";
  }

  if(Object.keys(valid).length > 0) {
    return valid;
  };
}

export default function Login () {
  const actionData = useActionData();
  const navigate = useNavigate();
  const isLogging = navigate.state === 'submitting'; 
  console.log(actionData)

  const key = actionData ? Object.keys(actionData) : null;

  // Redirect user if validation is successful
  if(actionData && actionData.success) {
    //return window.location.replace("/login")
  }
  
  return(
    <div className="container login-container">
      <section className="login-main">
        <h1>Log In</h1>
        <Form method="post" className="login-form">
          {/* 
          <label htmlFor="reg-email">Email:</label>
          <input name="email" type="email" id="reg-email" placeholder="Email" autoComplete="on" autoFocus />
          <label htmlFor="firstName">First Name:</label>
          <input name="firstName" type="text" id="firstName" placeholder="First Name" autoComplete="on"/>
          <label htmlFor="lastName">Last Name:</label>
          <input name="lastName" type="text" id="lastName" placeholder="Last Name" autoComplete="on"/> 
          */}
          <label htmlFor="username"/>
          <input name="username" type="text" id="username" placeholder="Username" autoComplete="on" autoFocus  />
          {actionData && key == "invalidUsername" || key == "unauthUsername" ? <span className="invalid">{actionData[key]}</span> : null}
          
          <label htmlFor="login-password"/>
          <input name="password" type="password" id="login-password" placeholder="Password" autoComplete="off"/>
          {actionData && key == "invalidPassword" || key == "unauthPassword" ? <span className="invalid">{actionData[key]}</span> : null}

          <button>{isLogging ? "Logging in..." : "Log in"}</button>
        </Form>
        <aside>Don't have an account? <NavLink to="/register">Register here</NavLink></aside>
      </section>
    </div>
  )
}