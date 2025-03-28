import React from "react";
import { Form, NavLink, useActionData, useNavigate, useLoaderData } from "react-router";
import "../assets/css/account.css";
import { sendData } from "../../client-utils";

export async function loader({ request, params }) {
  
  
}

export async function action({ request }) {
   // Form data
   const formData = await request.formData();
   const allData = Object.fromEntries(formData);
   const username = formData.get("username");
   const password = formData.get("password");
 
  const url = new URL(request.url);

   // Send form data to server
   const sendFormData = await sendData("login", allData, url);
  
   // All server side error validation responses
   if(sendFormData && sendFormData.serverError) {
     return sendFormData.serverError
   }

}

export default function Login () {
  const actionData = useActionData();
  const navigate = useNavigate();
  const isLogging = navigate.state === 'submitting'; 
  const loader = useLoaderData();

  const key = actionData ? Object.keys(actionData) : null;
  
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
          <input name="username" type="text" id="username" placeholder="Username" autoComplete="on" autoFocus required />
          {actionData && key == "invalidUsername" || key == "unauthUsername" ? <span className="invalid">{actionData[key]}</span> : null}
          
          <label htmlFor="login-password"/>
          <input name="password" type="password" id="login-password" placeholder="Password" autoComplete="off" required/>
          {actionData && key == "invalidPassword" || key == "unauthPassword" ? <span className="invalid">{actionData[key]}</span> : null}

          <button>{isLogging ? "Logging in..." : "Log in"}</button>
        </Form>
        <aside>Don't have an account? <NavLink to="/register">Register here</NavLink></aside>
      </section>
    </div>
  )
}