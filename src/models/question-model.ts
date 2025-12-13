export interface Question {
    id: number
    question: string
    option1: string
    option2: string
    option3: string
    option4: string
    answer: string
    levelId: number
}

export interface CreateQuestionRequest {
    question: string
    option1: string
    option2: string
    option3: string
    option4: string
    answer: string
    levelId: number
}

export interface QuestionResponse {
    id: number
    question: string
    option1: string
    option2: string
    option3: string
    option4: string
    answer: string
    levelId: number
}