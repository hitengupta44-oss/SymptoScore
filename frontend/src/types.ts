export type QuestionType = "number" | "select" | "choice";

export interface QuestionOption {
    label: string
    value: string
}

export interface Question {
    id: string
    label: string
    // Unified type to support both usages if needed, though we primarily use survey.tsx's structure now
    type?: QuestionType
    category?: string
    min?: number
    max?: number
    options?: string[]
}

export interface SurveyAnswers {
    [key: string]: number | string
}

export interface RiskFactor {
    delta: number
    direction: "increased" | "reduced"
    factor: string
}

export interface DiseaseReport {
    disease: string
    recommendation: string
    risk: number
    risk_band: string
    risk_factors: RiskFactor[]
}

export interface ApiResponse {
    report: DiseaseReport[]
    status: string
    ai_summary?: string
}
