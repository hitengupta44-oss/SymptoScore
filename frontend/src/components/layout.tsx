// components/MainLayout.jsx
import Navbar from "./navbar"
import Footer from "./footer"
import { Outlet } from "react-router-dom"

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}
