export interface UserTheme {
    id: number
    userId: number
    themeId: number
    unlocked: boolean
}

export interface UserThemeResponse {
    id: number
    userId: number
    themeId: number
    unlocked: boolean
    theme?: {
        id: number
        price: number
        primaryColor: string
        secondaryColor: string
        textColor: string
    }
}