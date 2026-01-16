import { useState } from "react"
import { ChevronRight, Activity, Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"

// --- TYPES ---
type QuestionType = "number" | "select"

interface Question {
  id: string
  label: string
  type?: QuestionType // Optional, defaults to select if undefined
  min?: number
  max?: number
  options?: string[]
}

// Define the shape of the data we send to Python (keys are strings, values are string or number)
interface SurveyAnswers {
  [key: string]: string | number
}

// --- DATA ---
const questions: Question[] = [
  { id: "age", label: "Age", type: "number", min: 18, max: 99 },
  { id: "Alcohol", label: "Do you consume Alcohol?", options: ["Yes", "No"] },
  { id: "BloodPressure", label: "Blood Pressure Level", options: ["High", "Normal", "Low"] },
  { id: "Breathlessness", label: "Do you experience Breathlessness?", options: ["Yes", "No"] },
  { id: "ChestPain", label: "Do you have Chest Pain?", options: ["Yes", "No"] },
  { id: "Cough", label: "Do you have a persistent Cough?", options: ["Yes", "No"] },
  { id: "DietQuality", label: "Diet Quality", options: ["Good", "Poor"] },
  { id: "Dizziness", label: "Do you experience Dizziness?", options: ["Yes", "No"] },
  { id: "ExcessiveThirst", label: "Excessive Thirst?", options: ["Yes", "No"] },
  { id: "FamilyHistoryDiabetes", label: "Family History: Diabetes", options: ["Yes", "No"] },
  { id: "FamilyHistoryHeart", label: "Family History: Heart Disease", options: ["Yes", "No"] },
  { id: "Fatigue", label: "Do you feel Fatigued?", options: ["Yes", "No"] },
  { id: "FrequentUrination", label: "Frequent Urination?", options: ["Yes", "No"] },
  { id: "Headache", label: "Frequent Headaches?", options: ["Yes", "No"] },
  { id: "LossOfAppetite", label: "Loss of Appetite?", options: ["Yes", "No"] },
  { id: "PaleSkin", label: "Pale Skin?", options: ["Yes", "No"] },
  { id: "PhysicalActivity", label: "Physical Activity Level", options: ["High", "Low", "Moderate"] },
  { id: "SaltIntake", label: "Salt Intake Level", options: ["High", "Low", "Moderate"] },
  { id: "Smoking", label: "Do you Smoke?", options: ["Yes", "No"] },
  { id: "StressLevel", label: "Stress Level", options: ["High", "Low", "Moderate"] },
  { id: "SugarLevel", label: "Sugar/Glucose Level", options: ["High", "Normal", "Low"] },
  { id: "SwellingAnkles", label: "Swelling in Ankles?", options: ["Yes", "No"] },
  { id: "WeightLoss", label: "Unexplained Weight Loss?", options: ["Yes", "No"] },
  { id: "Wheezing", label: "Wheezing?", options: ["Yes", "No"] },
]

const Survey = () => {
  const navigate = useNavigate()
  
  // State Management
  const [index, setIndex] = useState<number>(0)
  const [answers, setAnswers] = useState<SurveyAnswers>({})
  const [ageInput, setAgeInput] = useState<string>("") 
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

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

      // 2. Call Your Python API
      // Ensure your Flask backend is running on this port
      const response = await fetch("http://127.0.0.1:5000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
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
      setAgeInput("") // Clear input for safety
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
  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <h2 className="text-xl font-bold text-slate-900">Analyzing Symptoms...</h2>
        <p className="text-slate-500">Please wait while our AI generates your report.</p>
      </div>
    )
  }

  // === RENDER SURVEY ===
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Activity className="text-white w-5 h-5" />
          </div>
          <h1 className="text-lg font-extrabold text-slate-900">
            SymptoScore Screening
          </h1>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5 mb-6 rounded-full overflow-hidden">
          <div 
            className="bg-indigo-600 h-full transition-all duration-300" 
            style={{ width: `${((index) / questions.length) * 100}%` }}
          ></div>
        </div>

        {/* Question Counter */}
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">
          Question {index + 1} / {questions.length}
        </p>

        {/* Question Label */}
        <h2 className="text-2xl font-extrabold text-slate-900 mb-8">
          {current.label}
        </h2>

        {/* Dynamic Inputs */}
        <div className="space-y-3">
          
          {/* CASE 1: Number Input (Age) */}
          {current.type === "number" ? (
            <form onSubmit={handleAgeSubmit} className="space-y-4">
              <input
                type="number"
                value={ageInput}
                onChange={(e) => setAgeInput(e.target.value)}
                placeholder="Enter your age..."
                className="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 focus:border-indigo-600 focus:outline-none text-lg font-bold transition"
                autoFocus
              />
              <button
                type="submit"
                className="w-full flex justify-center items-center px-6 py-4 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
              >
                Next <ChevronRight className="ml-2 w-5 h-5" />
              </button>
            </form>
          ) : (
            
            /* CASE 2: Button Options */
            <div className="grid gap-3">
              {current.options?.map((option) => (
                <button
                  key={option}
                  onClick={() => handleOptionClick(option)}
                  className="w-full flex justify-between items-center px-6 py-4 rounded-2xl border-2 border-slate-100 hover:border-indigo-600 hover:bg-indigo-50 font-bold text-slate-700 transition group"
                >
                  {option}
                  <ChevronRight className="text-slate-300 group-hover:text-indigo-600 transition" />
                </button>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default Survey