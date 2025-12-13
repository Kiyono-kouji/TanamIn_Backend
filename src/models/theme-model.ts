// Consolidated theme + user-theme types in a single file (no external imports)

export interface UserTheme {
    id: number
    userId: number
    themeId: number
    unlocked: boolean
    // optional relation back to theme (when included by prisma queries)
    theme?: Theme
}

export interface Theme {
    id: number
    price: number
    primaryColor: string
    secondaryColor: string
    textColor: string
    // optional junction records when Prisma includes them
    userThemes?: UserTheme[]
}

export interface ThemeResponse {
    id: number
    price: number
    primaryColor: string
    secondaryColor: string
    textColor: string
    // whether this user has unlocked the theme
    unlocked: boolean
    // whether this theme is the user's currently active theme
    isActive: boolean
    // userId from the pivot table (User_Themes) if it exists, otherwise the requesting userId
    userId?: number
}

export interface PurchaseThemeRequest {
    themeId: number
}

export interface SetActiveThemeRequest {
    themeId: number
}