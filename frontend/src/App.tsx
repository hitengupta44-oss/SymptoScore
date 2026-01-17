import { Routes, Route } from "react-router-dom"
import LandingPage from "./pages/landingPage"
import Login from "./pages/login"
import Signup from "./pages/signup"
import Profile from "./pages/profile"
import Survey from "./pages/survey"
import Results from "./pages/results"
import MainLayout from "./components/layout"
import ProtectedRoute from "./components/ProtectedRoute"

export default function App() {
  return (
    <Routes>
      {/* Landing page ONLY */}
      <Route path="/" element={<LandingPage />} />

      {/* Public routes with layout */}
      <Route element={<MainLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      {/* Protected routes - require authentication */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/survey" element={<Survey />} />
          <Route path="/results/:id" element={<Results />} />
        </Route>
      </Route>
    </Routes>
  )
}