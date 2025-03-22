import React from "react";
import { Link } from "react-router";
import profileIcon from "../assets/images/profile-icon.svg"

export default function Header() {
  return (
    <header>
      <Link to="." className="logo">FitTrack</Link>
      <hr/>
      <nav>
        <Link to=".">home</Link>
        <Link to="about">about</Link>
        <Link to="dashboard">dash</Link>
      </nav>
      <Link to="/dashboard">
        <img src={profileIcon} alt="person icon" className="profile"/>
      </Link>
    </header>
  )
}