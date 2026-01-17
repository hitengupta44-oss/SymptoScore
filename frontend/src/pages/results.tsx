import { useState, useEffect, useMemo } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import {
  Activity, Stethoscope, AlertCircle, CheckCircle2,
  ChevronRight
} from "lucide-react"
import { supabase } from "../lib/supabase"
import type { ApiResponse } from "../types"

// --- COMPONENTS ---

// 1. Circular Progress Gauge
const Gauge = ({ value, label, color }: { value: number; label: string; color: string }) => {
  const size = 220
  const strokeWidth = 25
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <div className="flex flex-col items-center justify-center relative">
      <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Risk Probability</h3>
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background Circle */}
        <svg className="transform -rotate-90 w-full h-full">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#F1F5F9" // slate-100
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
          />
          {/* Foreground Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-6xl font-black text-slate-800 tracking-tighter" style={{ color: color }}>
            {value}%
          </span>
        </div>
      </div>
      <div className={`mt-8 px-8 py-2 rounded-full font-black text-sm uppercase tracking-widest bg-opacity-10`} style={{ backgroundColor: color + '20', color: color }}>
        {label}
      </div>
    </div>
  )
}

// 2. Main Results Page
const Results = () => {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const [reportData, setReportData] = useState<ApiResponse | null>(null)
  const [selectedDisease, setSelectedDisease] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // -- Fetch Data --
  useEffect(() => {
    const fetchReport = async () => {
      if (location.state?.report) {
        console.log("Report data received:", location.state.report)
        setReportData(location.state.report)
        setSelectedDisease(location.state.report.report[0].disease)
        setLoading(false)
        return
      }

      if (id) {
        try {
          const { data, error } = await supabase
            .from("health_reports")
            .select("analysis_result")
            .eq("id", id)
            .single()

          if (error || !data) throw error

          const result = data.analysis_result as ApiResponse
          setReportData(result)
          setSelectedDisease(result.report[0].disease)
        } catch (err) {
          console.error(err)
          navigate("/")
        } finally {
          setLoading(false)
        }
      } else {
        navigate("/")
      }
    }
    fetchReport()
  }, [id, location.state, navigate])

  // -- Helpers --
  const formatName = (str: string) => str.replace(/([A-Z])/g, ' $1').trim()

  // Parse markdown-like formatting from Gemini response
  const parseMarkdown = (text: string): string => {
    return text
      // Bold: **text** or __text__
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.+?)__/g, '<strong>$1</strong>')
      // Italic: *text* or _text_
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/_(.+?)_/g, '<em>$1</em>')
      // Numbered lists: 1. item
      .replace(/^(\d+)\.\s+(.+)$/gm, '<span class="font-semibold text-indigo-700">$1.</span> $2')
      // Bullet points: - item or * item
      .replace(/^[-*]\s+(.+)$/gm, '<span class="text-indigo-500 mr-2">•</span>$1')
  }

  const getRiskConfig = (risk: number) => {
    if (risk >= 50) return { color: "#ef4444", text: "High Risk", bg: "bg-red-50", border: "border-red-500" } // Red
    if (risk >= 20) return { color: "#f97316", text: "Moderate Risk", bg: "bg-orange-50", border: "border-orange-500" } // Orange
    return { color: "#10b981", text: "Low Risk", bg: "bg-emerald-50", border: "border-emerald-500" } // Emerald
  }

  const selectedItem = useMemo(() =>
    reportData?.report.find(r => r.disease === selectedDisease) || reportData?.report[0],
    [reportData, selectedDisease]
  )

  if (loading) return <div className="flex h-screen items-center justify-center bg-slate-50"><Activity className="animate-spin text-blue-600" /></div>
  if (!reportData || !selectedItem) return null

  const config = getRiskConfig(selectedItem.risk)
  const riskFactors = selectedItem.risk_factors.filter(f => f.direction === "increased")
  const protectiveFactors = selectedItem.risk_factors.filter(f => f.direction === "reduced")

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      {/* --- SIDEBAR --- */}
      <aside className="w-[340px] bg-white border-r border-slate-100 flex flex-col z-20 shadow-xl shadow-slate-200/50">
        <div className="p-8 pb-4">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 pl-2">Screening Panel ({reportData.report.length})</h3>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-3 custom-scrollbar">
          {reportData.report.map((item) => {
            const isActive = selectedDisease === item.disease
            const itemConfig = getRiskConfig(item.risk)
            return (
              <button
                key={item.disease}
                onClick={() => setSelectedDisease(item.disease)}
                className={`w-full p-4 rounded-2xl text-left transition-all duration-300 group relative overflow-hidden isolate ${isActive
                  ? 'bg-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] ring-1 ring-slate-200 translate-x-2'
                  : 'hover:bg-slate-50 hover:translate-x-1'
                  }`}
              >
                {isActive && <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${itemConfig.bg.replace('bg-', 'bg-').replace('50', '500')}`} />}
                <div className="flex justify-between items-center pl-4">
                  <div>
                    <h4 className={`text-sm font-bold mb-1 ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>{formatName(item.disease)}</h4>
                    <p className={`text-[10px] font-bold uppercase tracking-wide ${itemConfig.color.replace('#', 'text-[#')}`} style={{ color: itemConfig.color }}>
                      {itemConfig.text}
                    </p>
                  </div>
                  <ChevronRight size={16} className={`transition-transform duration-300 ${isActive ? 'text-slate-900 translate-x-0' : 'text-slate-300 -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} />
                </div>
              </button>
            )
          })}
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col relative overflow-hidden">

        {/* Scrollable Dashboard */}
        <div className="flex-1 overflow-y-auto p-10 bg-[#FAFAFA]">
          <div className="max-w-6xl mx-auto space-y-8 pb-20">

            {/* Page Header */}
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">{formatName(selectedItem.disease)} Analysis</h1>
                <p className="text-slate-500 font-medium text-lg">AI-Estimated Probability based on lifestyle factors</p>
              </div>
              <div className={`px-6 py-3 rounded-2xl border font-bold text-sm flex items-center gap-3 ${config.bg} ${config.border.replace('border-', 'text-').replace('500', '700')} border-opacity-50`}>
                <AlertCircle size={20} /> {selectedItem.risk > 20 ? "Attention Required" : "Optimal Health"}
              </div>
            </div>

            {/* Top Grid: Gauge + SHAP */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

              {/* Left: Gauge */}
              <div className="lg:col-span-5 bg-white rounded-[2rem] p-10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] border border-slate-100 flex items-center justify-center">
                <Gauge value={Math.round(selectedItem.risk)} label={config.text} color={config.color} />
              </div>

              {/* Right: SHAP Analysis */}
              <div className="lg:col-span-7 bg-white rounded-[2rem] p-10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] border border-slate-100">
                <div className="flex items-center gap-3 mb-8">
                  <Activity className="text-slate-400" />
                  <h3 className="text-lg font-bold text-slate-900">Why this result? (SHAP Analysis)</h3>
                </div>

                <div className="grid grid-cols-2 gap-12">
                  <div>
                    <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] mb-6 border-b border-rose-100 pb-2">Risk Factors (+)</h4>
                    <div className="space-y-6">
                      {riskFactors.length === 0 ? <p className="text-slate-400 text-sm italic">No significant risk factors.</p> :
                        riskFactors.map((f, i) => (
                          <div key={i} className="group">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-bold text-slate-700">{formatName(f.factor)}</span>
                              <span className="text-sm font-black text-rose-500">+{Math.round(f.delta)}%</span>
                            </div>
                            <div className="h-2 w-full bg-rose-50 rounded-full overflow-hidden">
                              <div className="h-full bg-rose-500 rounded-full" style={{ width: `${Math.min(f.delta * 2, 100)}%` }} />
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-6 border-b border-emerald-100 pb-2">Protective Factors (-)</h4>
                    <div className="space-y-6">
                      {protectiveFactors.length === 0 ? <p className="text-slate-400 text-sm italic">No significant protective factors.</p> :
                        protectiveFactors.map((f, i) => (
                          <div key={i} className="group">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-bold text-slate-700">{formatName(f.factor)}</span>
                              <span className="text-sm font-black text-emerald-500">-{Math.round(f.delta)}%</span>
                            </div>
                            <div className="h-2 w-full bg-emerald-50 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(f.delta * 2, 100)}%` }} />
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom: Recommendations */}
            <div className="bg-[#eff6ff] rounded-[2rem] p-10 border border-blue-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5"><Stethoscope size={200} /></div>
              <div className="flex items-center gap-3 mb-8 relative z-10">
                <Stethoscope className="text-blue-600" />
                <h3 className="text-lg font-bold text-blue-900">Preventive Recommendations</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                {selectedItem.recommendation.split(',').map((rec, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100 flex flex-col gap-4 hover:shadow-md transition-shadow">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                      <CheckCircle2 size={16} />
                    </div>
                    <p className="font-bold text-slate-700 leading-snug">{rec.trim()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Summary Section */}
            {reportData.ai_summary && (
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-[2rem] p-10 border border-indigo-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5"><Activity size={200} /></div>
                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div className="bg-indigo-600 p-2 rounded-xl">
                    <Activity className="text-white w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-indigo-900">AI Health Analysis</h3>
                  <span className="ml-auto text-xs font-bold text-indigo-500 bg-indigo-100 px-3 py-1 rounded-full">Powered by Gemini</span>
                </div>

                <div className="relative z-10 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-indigo-100">
                  <div className="prose prose-slate prose-sm max-w-none space-y-2">
                    {reportData.ai_summary.split('\n').map((line, i) => (
                      line.trim() && (
                        <p
                          key={i}
                          className="text-slate-700 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: parseMarkdown(line) }}
                        />
                      )
                    ))}
                  </div>
                </div>

                <p className="mt-4 text-xs text-indigo-400 relative z-10">
                  ⚠️ This AI-generated summary is for informational purposes only and should not replace professional medical advice.
                </p>
              </div>
            )}

            {/* Disclaimer Banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
              <div className="bg-amber-100 p-2 rounded-xl flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-bold text-amber-800 mb-1">Important Disclaimer</h4>
                <p className="text-sm text-amber-700">
                  SymptoScore is a health screening and recommendation tool designed to provide general health insights.
                  It is <span className="font-semibold">not a medical diagnosis</span>. The results shown here should not replace
                  professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider
                  for any health concerns or before making decisions about your health.
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}

export default Results