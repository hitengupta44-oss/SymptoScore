import { useEffect, useState} from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"

const Signup = () => {
  const navigate = useNavigate()

  const [loading, setLoading] = useState<boolean>(true)
  const [name, setName] = useState<string>("")
  const [age, setAge] = useState<string>("")
  const [gender, setGender] = useState<string>("")

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        navigate("/signup")
        return
      }

      // Google se name aata hai
      setName(user.user_metadata.full_name ?? "")
      setLoading(false)
    }

    fetchUser()
  }, [navigate])

  const handleSubmit = async (e:any) => {
    e.preventDefault()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      name,
      age: Number(age),
      gender,
    })

    if (error) {
      console.error(error.message)
      return
    }

    navigate("/profile")
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
        Loading...
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl border border-slate-800 bg-slate-900 p-6"
      >
        <h1 className="mb-1 text-xl font-semibold text-white">
          Complete your profile
        </h1>
        <p className="mb-5 text-sm text-slate-400">
          Just basic info. No drama.
        </p>

        {/* Name */}
        <div className="mb-4">
          <label className="mb-1 block text-sm text-slate-400">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md bg-slate-800 px-3 py-2 text-white outline-none ring-1 ring-slate-700 focus:ring-white"
            required
          />
        </div>

        {/* Age */}
        <div className="mb-4">
          <label className="mb-1 block text-sm text-slate-400">
            Age
          </label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full rounded-md bg-slate-800 px-3 py-2 text-white outline-none ring-1 ring-slate-700 focus:ring-white"
            required
            min={1}
          />
        </div>

        {/* Gender */}
        <div className="mb-6">
          <label className="mb-1 block text-sm text-slate-400">
            Gender
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full rounded-md bg-slate-800 px-3 py-2 text-white outline-none ring-1 ring-slate-700 focus:ring-white"
            required
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-white py-2 font-medium text-black transition hover:bg-gray-200"
        >
          Continue
        </button>
      </form>
    </div>
  )
}

export default Signup
