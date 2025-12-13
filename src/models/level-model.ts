export interface Level {
    id: number
    name: string
    isCompleted: boolean
    userId: number
}

export interface CreateLevelRequest {
    name: string
    userId: number
    isCompleted?: boolean
}

export interface UpdateLevelRequest {
    id: number
    name?: string
    isCompleted?: boolean
    userId?: number
}

export interface LevelResponse {
    id: number
    name: string
    isCompleted: boolean
    userId: number
}