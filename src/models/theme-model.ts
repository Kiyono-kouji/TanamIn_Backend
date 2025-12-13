export interface Theme {
    id: number
    price: number
    primaryColor: string
    secondaryColor: string
    textColor: string
}

export interface ThemeResponse {
    id: number
    price: number
    primaryColor: string
    secondaryColor: string
    textColor: string
    unlocked: boolean
    isActive: boolean
}

export interface PurchaseThemeRequest {
    themeId: number
}

export interface SetActiveThemeRequest {
    themeId: number
}