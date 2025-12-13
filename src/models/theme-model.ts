import type { UserTheme } from "./user_theme-model"

export interface Theme {
    id: number
    price: number
    colors?: Record<string, string> | null
    createdAt?: Date
    updatedAt?: Date
    user_Themes?: {
        id: number
        userId: number
        themeId: number
        unlocked: boolean
    }[]
}

export interface ThemeResponse {
    id: number
    price: number
    primary: string
    subprimary: string
    secondary: string
    subsecondary: string
    background: string
    subbackground: string
    text: string
    subtext: string
    pie1: string
    pie2: string
    unlocked: boolean
    isActive: boolean
    userId?: number
}

export interface PurchaseThemeRequest {
    themeId: number
}

export interface SetActiveThemeRequest {
    themeId: number
}