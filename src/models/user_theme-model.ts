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
    }
}