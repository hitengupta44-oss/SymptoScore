import { Routes, Route, useLocation } from "react-router-dom"
import LandingPage from "./pages/landingPage"
import Login from "./pages/login"
import Signup from "./pages/signup"
import Profile from "./pages/profile"
import Survey from "./pages/survey"
import Results from "./pages/results"
import Navbar from "./components/navbar"
import Footer from "./components/footer"

export default function App() {
  const location = useLocation()
  const isSurveyOrResult = location.pathname === '/survey' || location.pathname.startsWith('/results')

  return (
    <>
      {!isSurveyOrResult && <Navbar />}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/survey" element={<Survey />} />
        <Route path="/results/:id" element={<Results />} />
      </Routes>

      {!isSurveyOrResult && <Footer />}
    </>
  )
}
