import { UserCircle } from "lucide-react"
import { Link } from "react-router-dom"

const navbar = () => {
  return (
    <header className="w-full bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* App Name */}
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <span className="text-white font-black text-sm">SS</span>
          </div>
          <span className="text-lg font-extrabold text-slate-900 tracking-tight">
            SymptoScore
          </span>
        </Link>

        {/* Profile */}
        <Link
          to="/profile"
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition"
        >
          <UserCircle className="w-8 h-8" />
        </Link>

      </div>
    </header>
  )
}

export default navbar
