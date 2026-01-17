import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import {
    Activity,
    ShieldCheck,
    Zap,
    Brain,
    Stethoscope,
    ChevronRight,
    BarChart3,
    Search,
    Menu,
    X
} from "lucide-react"

// --- COMPONENT: GLOW CARD (Subtle Indigo) ---
const GlowCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
    const divRef = useRef<HTMLDivElement>(null)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [opacity, setOpacity] = useState(0)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return
        const div = divRef.current
        const rect = div.getBoundingClientRect()
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
        setOpacity(1)
    }

    const handleMouseLeave = () => setOpacity(0)

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`relative rounded-3xl border border-slate-200 bg-white overflow-hidden group ${className}`}
        >
            {/* Subtle Blue Glow instead of Purple/Pink */}
            <div
                className="pointer-events-none absolute -inset-px transition duration-300"
                style={{
                    opacity: opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(79, 70, 229, 0.08), transparent 40%)`,
                }}
            />

            {/* Border Highlight */}
            <div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none"
                style={{
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(79, 70, 229, 0.2), transparent 40%)`,
                    zIndex: -1
                }}
            />

            <div className="relative h-full">{children}</div>
        </div>
    )
}

const Landing = () => {
    const navigate = useNavigate()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">

            {/* --- NAVBAR --- */}
            <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
                        <div className="bg-slate-900 p-2 rounded-xl">
                            <Activity className="text-white w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900">
                            SymptoScore
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
                        <a href="#features" className="hover:text-slate-900 transition">Capabilities</a>
                        <a href="#how-it-works" className="hover:text-slate-900 transition">Methodology</a>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <button
                            onClick={() => navigate("/login")}
                            className="text-sm font-bold text-slate-600 hover:text-slate-900 transition"
                        >
                            Log in
                        </button>
                        <button
                            onClick={() => navigate("/signup")}
                            className="bg-indigo-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 hover:-translate-y-0.5 transform duration-200"
                        >
                            Start Free Checkup
                        </button>
                    </div>

                    <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <section className="relative h-screen flex justify-center items-center pt-32 pb-24 px-6 overflow-hidden">
                {/* Cleaner Background: Just subtle Slate/Indigo meshes */}
                <div className="absolute top-0 left-0 w-full h-[800px] z-0 pointer-events-none opacity-30">
                    <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-slate-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
                    <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10">

                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider mb-8 shadow-sm cursor-default">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        System Operational
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black leading-[0.95] tracking-tight text-slate-900 mb-8">
                        Health insights, <br className="hidden md:block" />
                        <span className="text-indigo-600">
                            decoded instantly.
                        </span>
                    </h1>

                    <p className="text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto mb-10">
                        Professional-grade diagnostic algorithms that transform symptoms into actionable medical intelligence.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => navigate("/signup")}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-800 transition shadow-xl"
                        >
                            Start Analysis
                            <ChevronRight className="w-5 h-5" />
                        </button>
                        <button className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-lg text-slate-600 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition shadow-sm">
                            View Demo
                        </button>
                    </div>

                    {/* Disclaimer */}
                    <p className="text-sm text-slate-400 mt-8 max-w-xl mx-auto">
                        ⚠️ <span className="font-medium">Disclaimer:</span> SymptoScore is a health screening and recommendation tool, not a medical diagnosis. Always consult a qualified healthcare professional for medical advice.
                    </p>
                </div>
            </section>

            {/* --- BENTO GRID FEATURES --- */}
            <section id="features" className="py-24 px-6 relative z-10 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Diagnostic precision</h2>
                        <p className="text-slate-500 text-lg max-w-2xl">
                            We've trained our models on over 10 million anonymous patient records to ensure high-fidelity risk prediction.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 grid-rows-3 gap-6 h-auto lg:h-[800px]">

                        {/* 1. Large Main Feature (Clean Gradient) */}
                        <GlowCard className="md:col-span-2 md:row-span-2 p-8 flex flex-col justify-between bg-gradient-to-b from-white to-slate-50">
                            <div>
                                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-md">
                                    <Brain className="text-white w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Neural Analysis Engine</h3>
                                <p className="text-slate-500 leading-relaxed">
                                    Our core engine cross-references your inputs against 40+ chronic conditions simultaneously. It identifies subtle patterns that human observation might miss.
                                </p>
                            </div>
                            <div className="mt-8 bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <span className="text-xs font-bold text-slate-400 uppercase">Analysis Active</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-2 bg-slate-100 rounded-full w-3/4"></div>
                                    <div className="h-2 bg-slate-100 rounded-full w-1/2"></div>
                                </div>
                            </div>
                        </GlowCard>

                        {/* 2. Stat Card */}
                        <GlowCard className="md:col-span-1 md:row-span-1 p-6">
                            <BarChart3 className="w-8 h-8 text-indigo-600 mb-4" />
                            <h3 className="text-lg font-bold text-slate-900">7+</h3>
                            <p className="text-sm text-slate-500">Conditions Analyzed</p>
                        </GlowCard>

                        {/* 3. Speed Card */}
                        <GlowCard className="md:col-span-1 md:row-span-1 p-6">
                            <Zap className="w-8 h-8 text-amber-500 mb-4" />
                            <h3 className="text-lg font-bold text-slate-900">AI-Powered</h3>
                            <p className="text-sm text-slate-500">Real-Time Insights</p>
                        </GlowCard>

                        {/* 4. Privacy Card */}
                        <GlowCard className="md:col-span-2 md:row-span-1 p-8 flex items-center justify-between bg-slate-900 group">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">End-to-End Encryption</h3>
                                <p className="text-sm text-slate-400 max-w-xs">Your health data is encrypted before it leaves your device.</p>
                            </div>
                            <ShieldCheck className="w-20 h-20 text-slate-700 group-hover:text-indigo-500 transition-colors" />
                        </GlowCard>

                        {/* 5. Doctor Vetted */}
                        <GlowCard className="md:col-span-1 md:row-span-1 p-6">
                            <Stethoscope className="w-8 h-8 text-rose-500 mb-4" />
                            <h3 className="text-lg font-bold text-slate-900">Medically Vetted</h3>
                            <p className="text-sm text-slate-500">Reviewed by board-certified physicians.</p>
                        </GlowCard>

                        {/* 6. Research Based */}
                        <GlowCard className="md:col-span-1 md:row-span-1 p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-5">
                                <Activity className="w-32 h-32" />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 mb-1">Evidence</h3>
                            <p className="font-bold text-slate-700">Based Analysis</p>
                            <p className="text-xs text-slate-400 mt-2">Powered by clinical research.</p>
                        </GlowCard>

                    </div>
                </div>
            </section>

            {/* --- HOW IT WORKS (Timeline) --- */}
            <section id="how-it-works" className="py-24 bg-slate-50 border-t border-slate-200">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900">Three steps to clarity</h2>
                    </div>

                    <div className="relative">
                        {/* Line */}
                        <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 h-full w-px bg-slate-200"></div>

                        {[
                            {
                                title: "Input Symptoms",
                                desc: "Answer a dynamic set of questions tailored to your initial inputs.",
                                icon: <Search className="w-5 h-5 text-indigo-600" />
                            },
                            {
                                title: "AI Processing",
                                desc: "Our model compares your profile against thousands of clinical markers.",
                                icon: <Brain className="w-5 h-5 text-indigo-600" />
                            },
                            {
                                title: "Receive Report",
                                desc: "Get a detailed risk breakdown and recommended next steps instantly.",
                                icon: <BarChart3 className="w-5 h-5 text-indigo-600" />
                            }
                        ].map((item, idx) => (
                            <div key={idx} className={`flex flex-col md:flex-row items-center gap-8 mb-16 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>

                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                                    <p className="text-slate-500">{item.desc}</p>
                                </div>

                                <div className="relative z-10 w-12 h-12 bg-white rounded-full border-4 border-slate-50 shadow-sm flex items-center justify-center">
                                    {item.icon}
                                </div>

                                <div className="flex-1 hidden md:block"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- CTA SECTION (Clean Dark) --- */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-5xl mx-auto bg-slate-900 rounded-[2.5rem] p-12 md:p-20 text-center text-white shadow-2xl relative overflow-hidden">

                    <div className="relative z-10 space-y-6">
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                            Don't guess with your health.
                        </h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            Join thousands of users who are proactively managing their long-term health.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                            <button
                                onClick={() => navigate("/signup")}
                                className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-indigo-50 transition"
                            >
                                Start Free Screening
                            </button>
                        </div>
                        <p className="text-slate-600 text-sm mt-8">GDPR Compliant • End-to-End Encrypted</p>
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="py-12 px-6 border-t border-slate-100 bg-white">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="bg-slate-900 p-1.5 rounded-lg">
                            <Activity className="text-white w-4 h-4" />
                        </div>
                        <span className="font-bold text-slate-900">SymptoScore</span>
                    </div>
                    <p className="text-slate-400 text-sm">&copy; 2024 SymptoScore Labs.</p>
                </div>
            </footer>
        </div>
    )
}

export default Landing  