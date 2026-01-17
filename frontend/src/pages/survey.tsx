import { useState, useEffect } from "react"
import { ChevronRight, Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import type { Question, SurveyAnswers } from "../types"


// --- DATA ---
const questions: Question[] = [
  { id: "age", label: "What is your current age?", type: "number", min: 18, max: 99, category: "Demographics" },
  { id: "Alcohol", label: "Do you consume Alcohol?", category: "Lifestyle", options: ["Yes", "No"] },
  { id: "BloodPressure", label: "Blood Pressure Level", category: "Cardiovascular", options: ["High", "Normal", "Low"] },
  { id: "Breathlessness", label: "Do you experience Breathlessness?", category: "Respiratory", options: ["Yes", "No"] },
  { id: "ChestPain", label: "Do you have Chest Pain?", category: "Cardiovascular", options: ["Yes", "No"] },
  { id: "Cough", label: "Do you have a persistent Cough?", category: "Respiratory", options: ["Yes", "No"] },
  { id: "DietQuality", label: "Diet Quality", category: "Lifestyle", options: ["Good", "Poor"] },
  { id: "Dizziness", label: "Do you experience Dizziness?", category: "Symptoms", options: ["Yes", "No"] },
  { id: "ExcessiveThirst", label: "Excessive Thirst?", category: "Symptoms", options: ["Yes", "No"] },
  { id: "FamilyHistoryDiabetes", label: "Family History: Diabetes", category: "Metabolic", options: ["Yes", "No"] },
  { id: "FamilyHistoryHeart", label: "Family History: Heart Disease", category: "Cardiovascular", options: ["Yes", "No"] },
  { id: "Fatigue", label: "Do you feel Fatigued?", category: "Symptoms", options: ["Yes", "No"] },
  { id: "FrequentUrination", label: "Frequent Urination?", category: "Symptoms", options: ["Yes", "No"] },
  { id: "Headache", label: "Frequent Headaches?", category: "Symptoms", options: ["Yes", "No"] },
  { id: "LossOfAppetite", label: "Loss of Appetite?", category: "Symptoms", options: ["Yes", "No"] },
  { id: "PaleSkin", label: "Pale Skin?", category: "Symptoms", options: ["Yes", "No"] },
  { id: "PhysicalActivity", label: "Physical Activity Level", category: "Lifestyle", options: ["High", "Low", "Moderate"] },
  { id: "SaltIntake", label: "Salt Intake Level", category: "Lifestyle", options: ["High", "Low", "Moderate"] },
  { id: "Smoking", label: "Do you Smoke?", category: "Lifestyle", options: ["Yes", "No"] },
  { id: "StressLevel", label: "Stress Level", category: "Mental Health", options: ["High", "Low", "Moderate"] },
  { id: "SugarLevel", label: "Sugar/Glucose Level", category: "Metabolic", options: ["High", "Normal", "Low"] },
  { id: "SwellingAnkles", label: "Swelling in Ankles?", category: "Symptoms", options: ["Yes", "No"] },
  { id: "WeightLoss", label: "Unexplained Weight Loss?", category: "Symptoms", options: ["Yes", "No"] },
  { id: "Wheezing", label: "Wheezing?", category: "Respiratory", options: ["Yes", "No"] },
]

const Survey = () => {
  const navigate = useNavigate()

  // State Management
  const [index, setIndex] = useState<number>(0)
  const [ageInput, setAgeInput] = useState<number>()
  const [answers, setAnswers] = useState<SurveyAnswers>({})
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(true)

  // Auto-fill age from profile
  useEffect(() => {
    const fetchProfileAge = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setIsLoadingProfile(false)
          return
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("age")
          .eq("id", user.id)
          .single()

        if (profile?.age) {
          // Pre-fill the age input field (user can still change it)
          setAgeInput(Number(profile.age))
        }
      } catch (error) {
        console.error("Error fetching profile age:", error)
      } finally {
        setIsLoadingProfile(false)
      }
    }

    fetchProfileAge()
  }, [])

  const current = questions[index]

  // === CORE SUBMISSION LOGIC ===
  const submitSurvey = async (finalData: SurveyAnswers) => {
    setIsSubmitting(true)
    try {
      // 1. Get Current User
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        alert("Please login to save results")
        navigate("/login") // Adjust route if needed
        return
      }
      console.log(finalData)

      // Rebuild data in the same sequence as questions
      const orderedData: Record<string, number | string> = {}
      for (const q of questions) {
        if (finalData[q.id] !== undefined) {
          orderedData[q.id] = finalData[q.id]
        }
      }

      // 2. Call Your Python API
      // Ensure your Flask backend is running on this port
      const response = await fetch("http://127.0.0.1:5000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderedData),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze data from API")
      }

      const reportData = await response.json()

      // 3. Save Input + Report to Supabase AND Return the new ID
      // We use .select().single() to get the newly created row back immediately
      const { data: insertedRecord, error } = await supabase
        .from("health_reports")
        .insert({
          user_id: user.id,
          input_data: finalData,
          analysis_result: reportData
        })
        .select()
        .single()

      if (error) throw error

      if (!insertedRecord) {
        throw new Error("Record saved but no ID returned")
      }

      // 4. Redirect to Results with the specific ID
      // We pass reportData in state so the next page doesn't have to fetch immediately
      navigate(`/results/${insertedRecord.id}`, { state: { report: reportData } })

    } catch (error: any) {
      console.error("Error submitting survey:", error)
      alert(error.message || "Something went wrong. Please check console.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // === NAVIGATION LOGIC ===
  const nextStep = (key: string, value: string | number) => {
    // 1. Update local state
    const updatedAnswers = { ...answers, [key]: value }
    setAnswers(updatedAnswers)

    // 2. Move to next question OR Submit
    if (index < questions.length - 1) {
      setIndex(index + 1)
      setAgeInput("")
    } else {
      submitSurvey(updatedAnswers)
    }
  }

  // Handler for Button Options
  const handleOptionClick = (value: string) => {
    if (isSubmitting) return
    nextStep(current.id, value)
  }

  // Handler for Number Input (Age)
  const handleAgeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    const val = parseInt(ageInput)
    if (!val || (current.min && val < current.min) || (current.max && val > current.max)) {
      alert(`Please enter a valid age between ${current.min} and ${current.max}`)
      return
    }
    nextStep(current.id, val)
  }

  // === RENDER LOADING STATE ===
  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <h2 className="text-xl font-bold text-slate-900">Loading your profile...</h2>
      </div>
    )
  }

  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <h2 className="text-xl font-bold text-slate-900">Analyzing Symptoms...</h2>
        <p className="text-slate-500">Please wait while our AI generates your report.</p>
      </div>
    )
  }

  // === RENDER SURVEY ===
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-2xl">

        {/* Progress Header */}
        <div className="mb-12">
          <div className="flex justify-between items-end mb-4 px-2">
            <h3 className="text-sm font-black text-blue-600 uppercase tracking-[0.2em]">{current.category || "General"}</h3>
            <span className="text-sm font-bold text-slate-400">{index + 1} / {questions.length}</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-500 ease-out"
              style={{ width: `${((index + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.05)] border border-slate-100 p-12 relative overflow-hidden">
          {/* Decorative background blob */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-slate-50 rounded-full opacity-50 pointer-events-none" />

          <div className="relative z-10 min-h-[300px] flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-12 leading-tight">
              {current.label}
            </h2>

            {/* Dynamic Inputs */}
            <div className="w-full">
              {/* CASE 1: Number Input (Age) */}
              {current.type === "number" ? (
                <form onSubmit={handleAgeSubmit} className="space-y-6">
                  <input
                    type="number"
                    value={ageInput}
                    onChange={(e) => setAgeInput(e.target.value)}
                    placeholder="Type your answer..."
                    className="w-full bg-slate-50 border-2 border-slate-100 focus:border-blue-500 rounded-2xl px-8 py-6 text-xl font-bold outline-none transition-all placeholder:text-slate-300 text-slate-800"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="w-full py-5 rounded-2xl bg-slate-900 text-white font-bold text-lg hover:bg-black transition-all shadow-xl shadow-slate-200 active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    Confirm <ChevronRight size={20} />
                  </button>
                </form>
              ) : (
                /* CASE 2: Button Options */
                <div className="space-y-4">
                  {current.options?.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleOptionClick(option)}
                      className="w-full text-left px-8 py-6 rounded-2xl border-2 border-slate-50 bg-white hover:border-blue-500 hover:bg-blue-50/50 shadow-sm hover:shadow-md transition-all font-bold text-slate-700 text-lg group flex justify-between items-center active:scale-[0.98]"
                    >
                      {option}
                      <ChevronRight className="opacity-0 group-hover:opacity-100 text-blue-500 transition-all -translate-x-2 group-hover:translate-x-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Survey