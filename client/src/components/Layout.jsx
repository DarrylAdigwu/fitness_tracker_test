import React from "react";
import { Outlet } from "react-router";
import { useCookies } from "react-cookie";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  const [cookies, setCookies] = useCookies([""]);
  const id = cookies.username ? `${cookies.username}` : ":id";

  return(
    <main>
      <div id="content-wrapper">
        <Header user_id={id}/>
        <Outlet />
      </div>
      <Footer />
    </main>
  )
}