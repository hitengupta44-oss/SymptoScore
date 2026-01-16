import { useNavigate } from "react-router-dom"
import { 
  Activity, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Brain, 
  Stethoscope, 
  ChevronRight 
} from "lucide-react"

const Landing = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Activity className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              SymptoScore
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-indigo-600 transition">Features</a>
            <a href="#how-it-works" className="hover:text-indigo-600 transition">How it Works</a>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate("/login")}
              className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition"
            >
              Log in
            </button>
            <button 
              onClick={() => navigate("/signup")}
              className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-indigo-600 transition shadow-lg shadow-indigo-200"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider border border-indigo-100">
              <Zap className="w-4 h-4" />
              AI-Powered Health Analysis
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight text-slate-900">
              Decode your <br />
              <span className="text-indigo-600">Health Risks</span> in seconds.
            </h1>
            
            <p className="text-lg text-slate-500 leading-relaxed max-w-lg">
              Advanced machine learning algorithms analyze your lifestyle markers to predict potential health risks before they become problems.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => navigate("/survey")} // Or /signup
                className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-indigo-700 transition shadow-xl shadow-indigo-200"
              >
                Start Free Screening
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button className="flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-lg text-slate-600 border-2 border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition">
                View Sample Report
              </button>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-3">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" />
                  </div>
                ))}
              </div>
              <p className="text-sm font-medium text-slate-500">
                Trusted by <span className="font-bold text-slate-900">2,000+</span> users this week.
              </p>
            </div>
          </div>

          {/* Hero Image / Graphic */}
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-600 blur-[100px] opacity-20 rounded-full"></div>
            <div className="relative bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl rotate-2 hover:rotate-0 transition duration-500">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Health Report</h3>
                  <p className="text-sm text-slate-400">Analysis Complete</p>
                </div>
                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Activity className="w-3 h-3" /> 98% Accuracy
                </div>
              </div>
              
              <div className="space-y-4">
                {[
                  { name: "Diabetes Risk", val: "Low", color: "bg-green-500", width: "w-1/4" },
                  { name: "Heart Health", val: "Optimal", color: "bg-indigo-500", width: "w-3/4" },
                  { name: "Hypertension", val: "Monitor", color: "bg-orange-500", width: "w-1/2" },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between text-sm font-bold text-slate-700">
                      <span>{item.name}</span>
                      <span>{item.val}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: item.width }}></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-4">
                <div className="bg-indigo-50 p-3 rounded-xl">
                  <Stethoscope className="text-indigo-600 w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Dr. AI Recommendation</p>
                  <p className="text-xs text-slate-500">Increase cardio activity by 15 mins...</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-4">Why choose SymptoScore?</h2>
            <p className="text-slate-500 text-lg">We combine medical knowledge with advanced AI to give you insights that actually matter.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: <Brain className="w-6 h-6" />, 
                title: "AI Precision", 
                desc: "Trained on millions of medical data points to provide accurate risk assessments." 
              },
              { 
                icon: <ShieldCheck className="w-6 h-6" />, 
                title: "100% Private", 
                desc: "Your health data is encrypted and never shared with insurance companies." 
              },
              { 
                icon: <Activity className="w-6 h-6" />, 
                title: "Actionable Insights", 
                desc: "Don't just get a score. Get real doctor-approved recommendations." 
              },
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900">How it works</h2>
          </div>

          <div className="space-y-12">
            {[
              { step: "01", title: "Answer Simple Questions", desc: "Spend 2 minutes answering basic questions about your lifestyle, diet, and history." },
              { step: "02", title: "AI Analysis", desc: "Our engine processes your inputs against global health datasets to identify patterns." },
              { step: "03", title: "Get Your Report", desc: "Receive a comprehensive breakdown of your risks and specific steps to improve." },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-6 md:items-center group">
                <div className="text-4xl font-black text-indigo-100 group-hover:text-indigo-600 transition duration-300">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-500 max-w-lg">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA FOOTER --- */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-indigo-600 rounded-[2.5rem] p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
              Ready to take control?
            </h2>
            <p className="text-indigo-100 text-lg max-w-2xl mx-auto">
              Join thousands of users who are proactively managing their long-term health with SymptoScore.
            </p>
            <button 
              onClick={() => navigate("/survey")}
              className="bg-white text-indigo-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-indigo-50 transition shadow-xl"
            >
              Start Your Screening Now
            </button>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-8 text-center text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} SymptoScore. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default Landing