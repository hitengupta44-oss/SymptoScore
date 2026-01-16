import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Activity, Stethoscope, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react"

// --- TYPES ---

interface RiskFactor {
  delta: number
  direction: "increased" | "reduced"
  factor: string
}

interface DiseaseReport {
  disease: string
  recommendation: string
  risk: number
  risk_band: string
  risk_factors: RiskFactor[]
}

interface ApiResponse {
  report: DiseaseReport[]
  status: string
}

// --- COMPONENT ---

const formatName = (str: string) => str.replace(/([A-Z])/g, ' $1').trim();

const Results = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  // 1. Properly type the location state
  const reportData = location.state?.report as ApiResponse | undefined
  
  const [selected, setSelected] = useState<DiseaseReport | null>(null)

  useEffect(() => {
    if (!reportData || !reportData.report) {
      navigate("/")
    } else {
      setSelected(reportData.report[0])
    }
  }, [reportData, navigate])

  if (!selected) return null

  return (
    <div className="min-h-screen bg-slate-100 p-6 flex justify-center">
      <div className="max-w-7xl w-full">
        
        <header className="flex items-center gap-3 mb-8">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Activity className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            SymptoScore Analysis
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <aside className="lg:col-span-4 space-y-3">
            {reportData?.report.map((item) => (
              <button
                key={item.disease}
                onClick={() => setSelected(item)}
                className={`w-full p-5 rounded-2xl border-2 text-left transition duration-200 group ${
                  selected.disease === item.disease
                    ? "bg-white border-indigo-600 shadow-lg scale-[1.02]"
                    : "bg-white/60 border-transparent hover:bg-white hover:border-slate-200"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-slate-800 text-base">
                      {formatName(item.disease)}
                    </h4>
                  </div>
                  <div className={`font-black text-lg ${item.risk > 50 ? 'text-red-500' : 'text-slate-700'}`}>
                    {item.risk}%
                  </div>
                </div>
                <div className="w-full bg-slate-200 h-1.5 mt-3 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${item.risk > 50 ? 'bg-red-500' : 'bg-indigo-500'}`} 
                    style={{ width: `${Math.min(item.risk * 1.5, 100)}%` }}
                  ></div>
                </div>
              </button>
            ))}
          </aside>

          <main className="lg:col-span-8 space-y-6">
            
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-4xl font-black text-slate-900 mb-2">
                    {formatName(selected.disease)}
                  </h2>
                  <div className="flex items-center gap-2 text-slate-500 font-medium">
                    <Activity className="w-4 h-4" />
                    AI Prediction Model
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 ${selected.risk > 50 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {selected.risk > 50 ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                  {selected.risk > 50 ? "High Priority" : "Monitor"}
                </div>
              </div>

              <div className="flex items-end gap-2 mb-2">
                <span className="text-7xl font-black text-indigo-600 tracking-tighter">
                  {selected.risk}%
                </span>
                <span className="text-lg font-bold text-slate-400 mb-4">Risk Probability</span>
              </div>
            </div>

            <div className="bg-indigo-600 rounded-3xl p-8 shadow-lg text-white">
              <div className="flex items-center gap-3 mb-4">
                <Stethoscope className="w-6 h-6 text-indigo-200" />
                <h3 className="text-lg font-bold text-indigo-100 uppercase tracking-wide">
                  Doctor Recommendation
                </h3>
              </div>
              <p className="text-2xl font-bold leading-relaxed">
                "{selected.recommendation}"
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-indigo-600" />
                Why this risk?
              </h3>
              
              <div className="space-y-3">
                {selected.risk_factors.map((factor, idx) => {
                  const isBad = factor.direction === "increased";
                  return (
                    <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <div className={`w-3 h-3 rounded-full shrink-0 ${isBad ? 'bg-red-500' : 'bg-green-500'}`} />
                      <div className="flex-1">
                        <span className="font-bold text-slate-800">
                          {formatName(factor.factor)}
                        </span>
                        <span className="text-slate-500 mx-1">
                          {factor.direction} risk by
                        </span>
                        <span className={`font-bold ${isBad ? 'text-red-600' : 'text-green-600'}`}>
                          {factor.delta}%
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

          </main>
        </div>
      </div>
    </div>
  )
}

export default Results