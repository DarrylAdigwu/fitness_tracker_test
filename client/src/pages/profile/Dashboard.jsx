import React from "react";
import { data, Form, useLoaderData } from "react-router";
import "../../assets/css/dashboard.css";
import plusIcon from "../../assets/images/plusIcon.svg";

/*export async function loader() {
  
}*/

export default function Dashboard() {
  const [exerciseCount, setExerciseCount] = React.useState(2)
  const schedule = useLoaderData();

  // Add current date to page
  function currentDate() {
    const date = new Date();

    let options = {
      weekday: "short", 
      year: "numeric",
      month: "short",
      day: "numeric",
    };

    return new Intl.DateTimeFormat("en-US", options).format(date);
  }

  // Show no schedule or schedule depending on loaderData
  const showSchedule = schedule ? 
    <div id="workout-schedule">
      <h1>Schedule here</h1>
    </div> :
    <div className="no-schedule" id="no-schedule">
      <h1>No workout schedule for today</h1>
      <button id="add-workout" onClick={newForm} type="button">Add workout</button>
  </div>


  // Create form for new workout
  function newForm(e) {
    const hideNoScheduleContainer = document.getElementById("no-schedule");
    const showContainer = document.getElementById("workout-form");

    if(e.currentTarget) {
      hideNoScheduleContainer.style.display = "none";
      showContainer.style.display = "flex";
    }
  }
  
  // Create new exercise inputs
  function newExercise() {
    setExerciseCount(prevCount => prevCount + 1);

    const prevInputBox = document.getElementById(`input-boxes-${exerciseCount - 1}`)
    
    // create div
    const inputBoxes = document.createElement("div");
    inputBoxes.setAttribute("class", "input-boxes");
    inputBoxes.setAttribute("id", `input-boxes-${exerciseCount}`);

    // create labels and inputs
    const newExerciseLabel = document.createElement("label");
    newExerciseLabel.setAttribute("for", `workout-input-${exerciseCount}`);
    
    const newExerciseInput = document.createElement("input");
    newExerciseInput.setAttribute("class", "workout-input");
    newExerciseInput.setAttribute("id", `workout-input-${exerciseCount}`);
    newExerciseInput.setAttribute("name", `workout-input-${exerciseCount}`);
    newExerciseInput.setAttribute("placeholder", "Choose an exercise");

    const newRepLabel = document.createElement("label");
    newRepLabel.setAttribute("for", `rep-input-${exerciseCount}` );

    const newRepInput = document.createElement("input");
    newRepInput.setAttribute("class", "rep-input");
    newRepInput.setAttribute("id", `rep-input-${exerciseCount}`);
    newRepInput.setAttribute("name", `rep-input-${exerciseCount}`);
    newRepInput.setAttribute("placeholder", "# of reps");

    // append child nodes
    inputBoxes.appendChild(newExerciseLabel);
    inputBoxes.appendChild(newExerciseInput);
    inputBoxes.appendChild(newRepLabel);
    inputBoxes.appendChild(newRepInput);
    
    // append div
    prevInputBox.after(inputBoxes)

    /*const inputBoxes = (
      <div className="input-boxes" id={`input-boxes-${exerciseCount}`}>
        <label htmlFor={`workout-input-${exerciseCount}`}></label>
        <input className="workout-input" id={`workout-input-${exerciseCount}`} name={`workout-input-${exerciseCount}`} placeholder="Choose an exercise"/>
        <label htmlFor={`rep-input-${exerciseCount}`}></label>
        <input className="rep-input" id={`rep-input-${exerciseCount}`} name={`rep-input-${exerciseCount}`} placeholder="# of reps"/>
      </div>
    )*/
    console.log(exerciseCount)
    console.log(prevInputBox)
    console.log(inputBoxes)
  }

  return(
    <div className="container dash-container">
      <div className="date">
        <button id="past-date">&lt;</button>
          <span>{currentDate()}</span>
        <button id="future-date">&gt;</button>
      </div>
      {showSchedule}
      <div id="workout-form" className="workout-form">
        <h1>Add Exercises</h1>
        <Form method="post">
          <div className="input-boxes" id="input-boxes-1">
            <label htmlFor="workout-input-1"></label>
            <input className="workout-input" id="workout-input-1" name="workout-input-1" placeholder="Choose an exercise"/>
            <label htmlFor="rep-input-1"></label>
            <input className="rep-input" id="rep-input-1" name="rep-input-1" placeholder="# of reps"/>
          </div>
          <div className="exercise-btn-container">
            <div id="add-exercise" onClick={newExercise}>
              <img src={plusIcon} alt="plus sign" />
              Add Exercise
            </div>
          </div>
          <button id="submit-exercise" type="submit">Submit</button>
        </Form>
      </div>
    </div>
  )
}