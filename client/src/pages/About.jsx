import React from "react";
import "../assets/css/about.css";
import deadlift from "../assets/images/dead-lift.jpg"

export default function About() {
  return (
    <div className="container about-container">
      <div className="banner">
        <img src={deadlift} alt="man doing dead lift"/>
      </div>
      <section className="main about-cta">
        <h1>Your fitness journey starts here</h1>
        <p>
          We make it our mission to be the workout partner you can rely on.
          Plan your workout for the day or in advance, record your exercises, 
          sets, weight, etc... and save your progress. 
        </p>
      </section>
    </div>
  )
}