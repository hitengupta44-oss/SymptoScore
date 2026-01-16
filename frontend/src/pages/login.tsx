import { supabase } from "../lib/supabase"

const Login = () => {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/survey",
      },
    })

    if (error) {
      console.error(error.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="w-full max-w-sm rounded-xl border border-slate-800 bg-slate-900 p-6 text-center">
        <h1 className="mb-2 text-2xl font-semibold text-white">
          Sign in
        </h1>

        <p className="mb-6 text-sm text-slate-400">
          Continue with Google to access your health screening
        </p>

        <button
          onClick={handleGoogleLogin}
          className="w-full rounded-md bg-white py-2 font-medium text-black transition hover:bg-gray-100"
        >
          Continue with Google
        </button>
      </div>
    </div>
  )
}

export default Login
