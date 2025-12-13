import type { UserTheme } from "./user_theme-model"

export interface Theme {
    id: number
    price: number
    primaryColor: string
    secondaryColor: string
    textColor: string
    userThemes?: UserTheme[]
}

export interface ThemeResponse {
    id: number
    price: number
    primaryColor: string
    secondaryColor: string
    textColor: string
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