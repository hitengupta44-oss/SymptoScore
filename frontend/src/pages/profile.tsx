import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"

type Profile = {
  name: string
  age: number
  gender: string
}

const Profile = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(true)
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        navigate("/signup")
        return
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("name, age, gender")
        .eq("id", user.id)
        .single()

      if (error) {
        console.error(error.message)
      } else {
        setProfile(data)
      }

      setLoading(false)
    }

    fetchProfile()
  }, [navigate])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
        Loading profile...
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
        No profile found
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h1 className="mb-4 text-xl font-semibold text-white">
          Profile
        </h1>

        <div className="space-y-4 text-sm">
          <div>
            <p className="text-slate-400">Name</p>
            <p className="text-white">{profile.name}</p>
          </div>

          <div>
            <p className="text-slate-400">Age</p>
            <p className="text-white">{profile.age}</p>
          </div>

          <div>
            <p className="text-slate-400">Gender</p>
            <p className="capitalize text-white">
              {profile.gender}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
