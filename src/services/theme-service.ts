import { prismaClient } from "../utils/database-util"
import { ThemeResponse, PurchaseThemeRequest, SetActiveThemeRequest } from "../models/theme-model"
import { Validation } from "../validations/validation"
import { ResponseError } from "../error/response-error"
import { ThemeValidation } from "../validations/theme-validation"

function mapTheme(theme: any, pivotUserId?: number, isUnlocked = false, isActive = false, fallbackUserId?: number): ThemeResponse {
    return {
        id: theme.id,
        price: theme.price,
        primary: theme.primary,
        subprimary: theme.subprimary,
        secondary: theme.secondary,
        subsecondary: theme.subsecondary,
        background: theme.background,
        subbackground: theme.subbackground,
        text: theme.text,
        subtext: theme.subtext,
        pie1: theme.pie1,
        pie2: theme.pie2,
        unlocked: isUnlocked,
        userId: pivotUserId ?? fallbackUserId
    } as ThemeResponse
}

export class ThemeService {
    static async getByUser(userId: number): Promise<ThemeResponse[]> {
        const themes = await prismaClient.themes.findMany({
            include: { user_Themes: { where: { userId } } }
        })

        const user = await prismaClient.users.findUnique({ where: { id: userId }, select: { activeThemeId: true } })
        const activeThemeId = user?.activeThemeId ?? 1

        return themes.map(t => {
            const pivot = Array.isArray(t.user_Themes) && t.user_Themes.length > 0 ? t.user_Themes[0] : undefined
            return mapTheme(t, pivot?.userId, !!pivot?.unlocked, t.id === activeThemeId, userId)
        })
    }

    static async purchase(userId: number, request: PurchaseThemeRequest): Promise<ThemeResponse> {
        const data = Validation.validate(ThemeValidation.PURCHASE, request)

        const theme = await prismaClient.themes.findUnique({ where: { id: data.themeId } })
        if (!theme) throw new ResponseError(404, "Theme not found")

        const existing = await prismaClient.user_Themes.findFirst({ where: { userId, themeId: data.themeId } })
        if (existing) throw new ResponseError(400, "Theme already purchased")

        const user = await prismaClient.users.findUnique({ where: { id: userId } })
        if (!user) throw new ResponseError(404, "User not found")
        if (user.coin < theme.price) throw new ResponseError(400, "Insufficient coins")

        await prismaClient.$transaction([
            prismaClient.users.update({ where: { id: userId }, data: { coin: { decrement: theme.price } } }),
            prismaClient.user_Themes.create({ data: { userId, themeId: data.themeId, unlocked: true } })
        ])

        return mapTheme(theme, userId, true, false, userId)
    }

    static async activate(userId: number, request: SetActiveThemeRequest): Promise<ThemeResponse> {
        const data = Validation.validate(ThemeValidation.SET_ACTIVE, request)

        const userTheme = await prismaClient.user_Themes.findFirst({
            where: { userId, themeId: data.themeId, unlocked: true },
            include: { theme: true }
        })
        if (!userTheme) throw new ResponseError(400, "Theme not purchased or unlocked")

        await prismaClient.users.update({ where: { id: userId }, data: { activeThemeId: data.themeId } })

        return mapTheme(userTheme.theme, userId, true, true, userId)
    }

    static async getActive(userId: number): Promise<ThemeResponse> {
        const user = await prismaClient.users.findUnique({ where: { id: userId }, include: { activeTheme: true } })
        if (!user || !user.activeTheme) throw new ResponseError(404, "Active theme not found")

        const userTheme = await prismaClient.user_Themes.findFirst({ where: { userId, themeId: user.activeThemeId, unlocked: true } })

        return mapTheme(user.activeTheme, userTheme?.userId ?? undefined, !!userTheme, true, userId)
    }
}