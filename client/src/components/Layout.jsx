import React from "react";
import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  return(
    <main>
      <div id="content-wrapper">
        <Header />
        <Outlet />
      </div>
      <Footer />
    </main>
  )
}