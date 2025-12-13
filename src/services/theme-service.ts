import { prismaClient } from "../utils/database-util"
import { ThemeResponse, PurchaseThemeRequest, SetActiveThemeRequest } from "../models/theme-model"
import { Validation } from "../validations/validation"
import { ResponseError } from "../error/response-error"
import { ThemeValidation } from "../validations/theme-validation"

export class ThemeService {
    static async getAllThemes(userId: number): Promise<ThemeResponse[]> {
        // Get all themes with their unlock status for the user
        const themes = await prismaClient.themes.findMany({
            include: {
                userThemes: {
                    where: { userId }
                }
            }
        })

        // Get user's active theme
        const user = await prismaClient.users.findUnique({
            where: { id: userId },
            select: { activeThemeId: true }
        })

        const activeThemeId = user?.activeThemeId || 1

        return themes.map(theme => ({
            id: theme.id,
            price: theme.price,
            primaryColor: theme.primaryColor,
            secondaryColor: theme.secondaryColor,
            textColor: theme.textColor,
            unlocked: theme.userThemes.length > 0 ? theme.userThemes[0].unlocked : false,
            isActive: theme.id === activeThemeId
        }))
    }

    static async purchaseTheme(userId: number, request: PurchaseThemeRequest): Promise<ThemeResponse> {
        const data = Validation.validate(ThemeValidation.PURCHASE, request)
        
        // Check if theme exists
        const theme = await prismaClient.themes.findUnique({
            where: { id: data.themeId }
        })

        if (!theme) {
            throw new ResponseError(404, "Theme not found")
        }

        // Check if user already owns this theme
        const existingUserTheme = await prismaClient.user_Themes.findFirst({
            where: {
                userId,
                themeId: data.themeId
            }
        })

        if (existingUserTheme) {
            throw new ResponseError(400, "Theme already purchased")
        }

        // Check user's coin balance
        const user = await prismaClient.users.findUnique({
            where: { id: userId }
        })

        if (!user) {
            throw new ResponseError(404, "User not found")
        }

        if (user.coin < theme.price) {
            throw new ResponseError(400, "Insufficient coins")
        }

        // Deduct coins and unlock theme
        await prismaClient.$transaction([
            prismaClient.users.update({
                where: { id: userId },
                data: { coin: { decrement: theme.price } }
            }),
            prismaClient.user_Themes.create({
                data: {
                    userId,
                    themeId: data.themeId,
                    unlocked: true
                }
            })
        ])

        return {
            id: theme.id,
            price: theme.price,
            primaryColor: theme.primaryColor,
            secondaryColor: theme.secondaryColor,
            textColor: theme.textColor,
            unlocked: true,
            isActive: false
        }
    }

    static async setActiveTheme(userId: number, request: SetActiveThemeRequest): Promise<ThemeResponse> {
        const data = Validation.validate(ThemeValidation.SET_ACTIVE, request)

        // Check if user owns this theme
        const userTheme = await prismaClient.user_Themes.findFirst({
            where: {
                userId,
                themeId: data.themeId,
                unlocked: true
            },
            include: {
                theme: true
            }
        })

        if (!userTheme) {
            throw new ResponseError(400, "Theme not purchased or unlocked")
        }

        // Update user's active theme
        await prismaClient.users.update({
            where: { id: userId },
            data: { activeThemeId: data.themeId }
        })

        return {
            id: userTheme.theme.id,
            price: userTheme.theme.price,
            primaryColor: userTheme.theme.primaryColor,
            secondaryColor: userTheme.theme.secondaryColor,
            textColor: userTheme.theme.textColor,
            unlocked: true,
            isActive: true
        }
    }

    static async getActiveTheme(userId: number): Promise<ThemeResponse> {
        // Get user's active theme
        const user = await prismaClient.users.findUnique({
            where: { id: userId },
            include: {
                activeTheme: true
            }
        })

        if (!user || !user.activeTheme) {
            throw new ResponseError(404, "Active theme not found")
        }

        // Check if user owns this theme
        const userTheme = await prismaClient.user_Themes.findFirst({
            where: {
                userId,
                themeId: user.activeThemeId,
                unlocked: true
            }
        })

        return {
            id: user.activeTheme.id,
            price: user.activeTheme.price,
            primaryColor: user.activeTheme.primaryColor,
            secondaryColor: user.activeTheme.secondaryColor,
            textColor: user.activeTheme.textColor,
            unlocked: !!userTheme,
            isActive: true
        }
    }
}