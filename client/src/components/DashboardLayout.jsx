import React from "react";
import { useLoaderData, Outlet } from "react-router";

export async function loader({ request }) {
  
}

export default function DashboardLayout() {
  return(
    <>
      <Outlet/>
    </>
  )
}