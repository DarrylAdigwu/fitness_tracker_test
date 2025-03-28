import React  from "react";
import { Link, useLoaderData } from "react-router";
import profileIcon from "../assets/images/profile-icon.svg"

export default function Header(props) {
  
  return (
    <header>
      <Link to="." className="logo">FitTrack</Link>
      <hr/>
      <nav>
        <Link to=".">home</Link>
        <Link to="about">about</Link>
        <Link to={`dashboard/${props.user_id}`}>dash</Link>
      </nav>
      <Link to={`dashboard/${props.user_id}`}>
        <img src={profileIcon} alt="person icon" className="profile"/>
      </Link>
    </header>
  )
}