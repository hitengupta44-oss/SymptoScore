import { useEffect, useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import {
  Calendar,
  ChevronRight,
  Plus,
  Activity,
  Clock,
  TrendingUp,
  TrendingDown,
  Loader2
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"

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
  analysis_result: {
    report: AnalysisReport[]
  }
}

// --- HELPER: FORMAT DATE ---
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// --- COMPONENT: TREND CHART (Using Recharts) ---
const HealthTrendChart = ({ reports }: { reports: HealthReport[] }) => {
  const data = useMemo(() => {
    // Clone and reverse so graph goes Left (Oldest) -> Right (Newest)
    const sorted = [...reports].reverse()

    return sorted.map(r => {
      const totalRisk = r.analysis_result.report.reduce((acc, curr) => acc + curr.risk, 0)
      const avgRisk = totalRisk / r.analysis_result.report.length
      // Health Score = 100 - Avg Risk (Higher is better)
      return {
        date: formatDate(r.created_at),
        score: Math.round(100 - avgRisk),
        fullDate: new Date(r.created_at).toLocaleDateString()
      }
    })
  }, [reports])

  // Need at least 2 points to draw a line
  if (data.length < 2) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-sm border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/50">
        <Activity className="w-8 h-8 mb-3 opacity-50" />
        <span className="font-medium">Complete at least 2 surveys to unlock trends</span>
      </div>
    )
  }

  // Calculate Trend
  const startScore = data[0].score
  const currentScore = data[data.length - 1].score
  const difference = currentScore - startScore
  const isPositive = difference >= 0

  // Dynamic Colors based on trend
  const color = isPositive ? "#10b981" : "#f43f5e" // Emerald vs Rose

  return (
    <div className="w-full">
      {/* Chart Header */}
      <div className="flex justify-between items-end mb-6 px-2">
        <div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Wellness Score</p>
          <h3 className="text-4xl font-black text-slate-900">{currentScore}<span className="text-lg text-slate-400 font-medium ml-1">/100</span></h3>
        </div>
        <div className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {Math.abs(difference)}% {isPositive ? "Improvement" : "Drop"}
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="h-[200px] w-full -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
              dy={10}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
              itemStyle={{ color: '#1e293b', fontWeight: 'bold' }}
              labelStyle={{ color: '#64748b', marginBottom: '4px', fontSize: '12px' }}
              cursor={{ stroke: '#cbd5e1', strokeWidth: 2, strokeDasharray: '4 4' }}
            />

            <Area
              type="monotone"
              dataKey="score"
              stroke={color}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorScore)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// --- SUB-COMPONENT: REPORT CARD ---
const ReportCard = ({ report, onClick }: { report: HealthReport; onClick: () => void }) => {
  const topRisk = report.analysis_result?.report?.reduce((prev, current) =>
    (prev.risk > current.risk) ? prev : current
    , report.analysis_result.report[0])

  const dateStr = formatDate(report.created_at)

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
        <div className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${topRisk?.risk > 50 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
          }`}>
          {topRisk?.risk > 50 ? 'High Risk' : 'Optimal'}
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
          <span className={`text-2xl font-black ${topRisk?.risk > 50 ? 'text-red-500' : 'text-indigo-500'
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
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          navigate("/login")
          return
        }

        const profileReq = supabase
          .from("profiles")
          .select("name, age, gender")
          .eq("id", user.id)
          .single()

        const reportsReq = supabase
          .from("health_reports")
          .select("id, created_at, analysis_result")
          .eq("user_id", user.id)
          .order('created_at', { ascending: false })

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
      <div className="max-w-6xl mx-auto space-y-8">

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

          {/* --- LEFT COLUMN: USER INFO & CHARTS --- */}
          <aside className="lg:col-span-4 space-y-6">

            {/* User Card */}
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-xl font-black text-indigo-600 flex-shrink-0 shadow-inner">
                {profile?.name ? profile.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">{profile?.name}</h2>
                <p className="text-slate-400 text-sm font-medium capitalize">{profile?.gender} • {profile?.age} yrs</p>
              </div>
            </div>

            {/* CHART CARD (With Recharts) */}
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
              <HealthTrendChart reports={reports} />
            </div>

          </aside>

          {/* --- RIGHT COLUMN: HISTORY LIST --- */}
          <main className="lg:col-span-8">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-bold text-slate-700">Assessment History</h3>
              <span className="ml-auto text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                {reports.length} Total
              </span>
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