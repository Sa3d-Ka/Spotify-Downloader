import React from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "../components/Navbar";

const Layout = () => {
  return (
    <>
      <ToastContainer theme="dark" />
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
