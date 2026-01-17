import { Routes, Route } from "react-router-dom"
import LandingPage from "./pages/landingPage"
import Login from "./pages/login"
import Signup from "./pages/signup"
import Profile from "./pages/profile"
import Survey from "./pages/survey"
import Results from "./pages/results"
import MainLayout from "./components/layout"

export default function App() {
  return (
    <Routes>
      {/* Landing page ONLY */}
      <Route path="/" element={<LandingPage />} />

      {/* Pages WITH Navbar + Footer */}
      <Route element={<MainLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/survey" element={<Survey />} />
        <Route path="/results/:id" element={<Results />} />
      </Route>
    </Routes>
  )
}
