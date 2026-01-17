import { useState, useEffect } from "react"
import { UserCircle, Activity } from "lucide-react"
import { Link } from "react-router-dom"
import { supabase } from "../lib/supabase"
import LogoutButton from "./LogoutButton"

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Check initial session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsLoggedIn(!!session)
    }
    checkSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <header className="w-full bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between">

        {/* App Name */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="bg-slate-900 p-2 rounded-xl">
              <Activity className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              SymptoScore
            </span>
          </div>
        </Link>

        {/* Right Side: Auth Actions */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition"
              >
                <UserCircle className="w-8 h-8" />
              </Link>
              <LogoutButton variant="minimal" />
            </>
          ) : (
            <Link
              to="/login"
              className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition"
            >
              Log in
            </Link>
          )}
        </div>

      </div>
    </header>
  )
}

export default Navbar

