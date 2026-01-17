import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { Activity, ArrowRight, Loader2 } from "lucide-react"

// Google Icon
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
)

const Signup = () => {
  const navigate = useNavigate()

  const [loading, setLoading] = useState<boolean>(true)
  const [user, setUser] = useState<any>(null)
  
  // Form Fields
  const [name, setName] = useState<string>("")
  const [age, setAge] = useState<string>("")
  const [gender, setGender] = useState<string>("")
  const [saving, setSaving] = useState(false)

  // 1. Check Auth & Existing Profile
  useEffect(() => {
    const checkUserAndProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // User is logged in. 
        // OPTIONAL: Check if they already have a profile row in Supabase
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        // If profile exists and has age, skip this page and go to survey!
        if (profile && profile.age) {
          navigate("/survey")
          return
        }

        // Otherwise, set user and pre-fill name
        setUser(user)
        setName(user.user_metadata.full_name ?? "")
      }
      
      setLoading(false)
    }

    checkUserAndProfile()
  }, [navigate])

  // 2. Google Login Trigger
  const handleGoogleSignup = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // Return to this page to check if we need to fill info
        redirectTo: window.location.origin + "/signup",
      },
    })
    if (error) console.error(error.message)
  }

  // 3. Save Profile Info
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSaving(true)

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      name,
      age: Number(age),
      gender,
    })

    if (error) {
      console.error(error.message)
      setSaving(false)
    } else {
      // Done! Go to Survey
      navigate("/survey")
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-[2rem] shadow-xl p-8 md:p-12 border border-slate-100">
        
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center bg-indigo-600 p-3 rounded-2xl mb-6 shadow-lg shadow-indigo-200">
            <Activity className="text-white w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">
            {user ? "Almost there!" : "Create Account"}
          </h1>
          <p className="text-slate-500 text-lg">
            {user ? "Just a few details to personalize your health analysis." : "Join SymptoScore to track your health risks."}
          </p>
        </div>

        {/* --- STATE 1: NOT LOGGED IN --- */}
        {!user ? (
          <div className="space-y-6">
            <button
              onClick={handleGoogleSignup}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-200 text-slate-700 font-bold py-5 px-6 rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition duration-200 text-lg group"
            >
              <GoogleIcon />
              <span className="group-hover:text-slate-900">Sign up with Google</span>
            </button>
            <div className="flex items-center gap-2 justify-center text-sm text-slate-400">
              <span>Already have an account?</span>
              <button onClick={() => navigate("/login")} className="text-indigo-600 font-bold hover:underline">
                Log in
              </button>
            </div>
          </div>
        ) : (
          /* --- STATE 2: LOGGED IN (Fill Profile) --- */
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-slate-900 font-medium focus:outline-none focus:border-indigo-600 focus:bg-white transition"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Age */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-slate-900 font-medium focus:outline-none focus:border-indigo-600 focus:bg-white transition"
                  required
                  min={18}
                  max={100}
                />
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Gender</label>
                <div className="relative">
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-slate-900 font-medium focus:outline-none focus:border-indigo-600 focus:bg-white transition appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-5 rounded-2xl hover:bg-indigo-700 transition shadow-xl shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  Complete Profile <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default Signup