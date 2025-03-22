import React from "react";
import { Form, NavLink } from "react-router";
import "../assets/css/account.css"

export default function Login () {
  return(
    <div className="container login-container">
      <section className="login-main">
        <h1>Log In</h1>
        <Form method="post" className="login-form">
          <label htmlFor="login-email"/>
          <input name="email" type="email" id="login-email" placeholder="Email" autoComplete="on" autoFocus />
          <label htmlFor="login-password"/>
          <input name="password" type="password" id="login-password" placeholder="Password" autoComplete="off"/>
          <button>Submit</button>
        </Form>
        <aside>Don't have an account? <NavLink to="/register">Register here</NavLink></aside>
      </section>
    </div>
  )
}