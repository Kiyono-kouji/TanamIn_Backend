export interface Theme {
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
    userId?: number
}

export interface PurchaseThemeRequest {
    themeId: number
}

export interface SetActiveThemeRequest {
    themeId: number
}