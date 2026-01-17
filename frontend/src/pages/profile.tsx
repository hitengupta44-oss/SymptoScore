import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { 
  User, 
  Calendar, 
  ChevronRight, 
  Plus, 
  Activity, 
  Clock, 
  TrendingUp,
  Loader2
} from "lucide-react"

// --- TYPES ---
type ProfileData = {
  name: string
  age: number
  gender: string
}

type AnalysisReport = {
  disease: string
  risk: number
  risk_band: string
}

type HealthReport = {
  id: string
  created_at: string
  // matches the JSON structure we saved earlier
  analysis_result: {
    report: AnalysisReport[]
  }
}

// --- SUB-COMPONENT: REPORT CARD ---
const ReportCard = ({ report, onClick }: { report: HealthReport; onClick: () => void }) => {
  // 1. Find the highest risk to display as a "Preview"
  const topRisk = report.analysis_result?.report?.reduce((prev, current) => 
    (prev.risk > current.risk) ? prev : current
  , report.analysis_result.report[0])

  // Format Date (e.g., "Oct 24, 2023")
  const dateStr = new Date(report.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

  return (
    <button 
      onClick={onClick}
      className="w-full bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group text-left"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
          <Calendar className="w-3 h-3" />
          {dateStr}
        </div>
        <div className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
          topRisk?.risk > 50 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
        }`}>
          {topRisk?.risk > 50 ? 'High Risk Detected' : 'All Good'}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-slate-500 mb-0.5">Primary Assessment</p>
          <h4 className="font-bold text-slate-800 text-lg">
            {topRisk?.disease || "General Checkup"}
          </h4>
        </div>
        <div className="text-right">
          <span className={`text-2xl font-black ${
             topRisk?.risk > 50 ? 'text-red-500' : 'text-indigo-500'
          }`}>
            {topRisk?.risk}%
          </span>
          <p className="text-xs text-slate-400 font-medium">Risk Score</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-sm font-semibold text-indigo-600 group-hover:text-indigo-700">
        View Full Analysis
        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </div>
    </button>
  )
}

// --- MAIN PROFILE COMPONENT ---
const Profile = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(true)
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [reports, setReports] = useState<HealthReport[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Get Current User
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          navigate("/login")
          return
        }

        // 2. Fetch Profile Data
        const profileReq = supabase
          .from("profiles")
          .select("name, age, gender")
          .eq("id", user.id)
          .single()

        // 3. Fetch Health Reports (Surveys)
        const reportsReq = supabase
          .from("health_reports")
          .select("id, created_at, analysis_result")
          .eq("user_id", user.id)
          .order('created_at', { ascending: false }) // Newest first

        // Run both requests in parallel
        const [profileRes, reportsRes] = await Promise.all([profileReq, reportsReq])

        if (profileRes.error) console.error("Profile Error:", profileRes.error)
        if (reportsRes.error) console.error("Reports Error:", reportsRes.error)

        setProfile(profileRes.data)
        setReports(reportsRes.data || [])

      } catch (error) {
        console.error("Unexpected error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [navigate])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* --- HEADER --- */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Dashboard</h1>
            <p className="text-slate-500">Welcome back, {profile?.name?.split(' ')[0] || 'User'}</p>
          </div>
          <button 
            onClick={() => navigate("/survey")}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition active:scale-95"
          >
            <Plus className="w-5 h-5" />
            New Assessment
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- LEFT COLUMN: USER INFO --- */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 text-center">
              <div className="w-24 h-24 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4 text-4xl">
                 🤖
              </div>
              <h2 className="text-xl font-bold text-slate-900">{profile?.name}</h2>
              <p className="text-slate-400 text-sm mb-6">{profile?.gender} • {profile?.age} years old</p>
              
              <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-6">
                <div className="text-center">
                  <span className="block text-2xl font-black text-slate-900">{reports.length}</span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Checkups</span>
                </div>
                <div className="text-center border-l border-slate-50">
                  <span className="block text-2xl font-black text-green-500">
                    {reports.length > 0 ? "Active" : "-"}
                  </span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Status</span>
                </div>
              </div>
            </div>

            {/* Quick Stats / Info Widget */}
            <div className="bg-indigo-900 p-6 rounded-[2rem] shadow-lg text-white relative overflow-hidden">
               <div className="relative z-10">
                 <div className="bg-white/10 w-fit p-2 rounded-lg mb-4">
                   <TrendingUp className="w-5 h-5 text-indigo-300" />
                 </div>
                 <h3 className="font-bold text-lg mb-1">Health Tip</h3>
                 <p className="text-indigo-200 text-sm leading-relaxed">
                   Regular screenings can detect issues early. Great job keeping track of your history!
                 </p>
               </div>
               {/* Decorative Circle */}
               <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl"></div>
            </div>
          </aside>

          {/* --- RIGHT COLUMN: HISTORY LIST --- */}
          <main className="lg:col-span-8">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-slate-400" />
              <h3 className="text-lg font-bold text-slate-700">Assessment History</h3>
            </div>

            {reports.length === 0 ? (
              // EMPTY STATE
              <div className="bg-white rounded-[2rem] border border-dashed border-slate-300 p-12 text-center">
                <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">No assessments yet</h3>
                <p className="text-slate-500 max-w-xs mx-auto mb-6">
                  Take your first AI-powered health screening to get your SymptoScore.
                </p>
                <button 
                  onClick={() => navigate("/survey")}
                  className="text-indigo-600 font-bold hover:underline"
                >
                  Start First Survey
                </button>
              </div>
            ) : (
              // LIST OF CARDS
              <div className="grid md:grid-cols-2 gap-4">
                {reports.map((report) => (
                  <ReportCard 
                    key={report.id} 
                    report={report} 
                    onClick={() => navigate(`/results/${report.id}`)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default Profile