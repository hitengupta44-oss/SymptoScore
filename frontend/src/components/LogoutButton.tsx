import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { LogOut, Loader2 } from "lucide-react"

interface LogoutButtonProps {
    className?: string
    variant?: "default" | "minimal"
}

const LogoutButton = ({ className = "", variant = "default" }: LogoutButtonProps) => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const handleLogout = async () => {
        setLoading(true)
        try {
            const { error } = await supabase.auth.signOut()
            if (error) throw error
            navigate("/login")
        } catch (error) {
            console.error("Logout error:", error)
        } finally {
            setLoading(false)
        }
    }

    if (variant === "minimal") {
        return (
            <button
                onClick={handleLogout}
                disabled={loading}
                className={`flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-red-600 transition ${className}`}
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                Logout
            </button>
        )
    }

    return (
        <button
            onClick={handleLogout}
            disabled={loading}
            className={`flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-bold hover:bg-red-100 transition ${className}`}
        >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
            Logout
        </button>
    )
}

export default LogoutButton
