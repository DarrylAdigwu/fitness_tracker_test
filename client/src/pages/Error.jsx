import React from "react";
import { NavLink } from "react-router";

export default function Error() {
  return(
    <div className="container error-container">
      <section className="main error-main">
        <h1>Uh oh! Page Not Found</h1>
        <p>
          Here's the good news...you can
          return to the FitTrack site using the 
          button below <span>&#128071;&#128527;</span>
        </p>
        <NavLink to="/">Return home</NavLink>
      </section>
    </div>
  )
}