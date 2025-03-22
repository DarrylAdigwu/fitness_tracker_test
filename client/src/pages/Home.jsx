import React from "react";
import { NavLink, useLoaderData } from "react-router";
import "../assets/css/home.css";

/*export async function loader() {
  const response = await fetch("http://localhost:8080/");
  if(!response.ok) {
    throw new Error(`Error status:${response.status}`);
  }
  const data = await response.json();
  return data.fruits;
}*/

export default function Home() {
  return(
      <div className="container home-container">
        <div className="home-bg">
          <div className="overlay"></div>
        </div>
        <section className="main home-cta">
          <h1>Tracking is a drag, but let's make tracking look easy</h1>
          <p>
            FitTrack is your reliable workout partner. Start 
            recording, timing, and tracking your daily 
            fitness progress
          </p>
          <NavLink to="register">Get Started</NavLink>
        </section>
      </div>
  )
}