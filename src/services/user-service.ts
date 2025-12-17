import { ResponseError } from "../error/response-error"
import {
    LoginUserRequest,
    RegisterUserRequest,
    toUserResponse,
    UserResponse,
    ProfileResponse,
    UpdateProfileRequest,
    UpdateBudgetingPercentageRequest,
} from "../models/user-model"
import { prismaClient } from "../utils/database-util"
import { UserValidation } from "../validations/user-validation"
import { Validation } from "../validations/validation"
import bcrypt from "bcrypt"

export class UserService {
    static async register(request: RegisterUserRequest): Promise<UserResponse> {
        const validatedData = Validation.validate(
            UserValidation.REGISTER,
            request
        )

        const email = await prismaClient.users.findFirst({
            where: {
                email: validatedData.email,
            },
        })

        if (email) {
            throw new ResponseError(400, "Email has already existed!")
        }

        validatedData.password = await bcrypt.hash(validatedData.password, 10)

        const user = await prismaClient.users.create({
            data: {
                name: validatedData.name,
                username: validatedData.username,
                email: validatedData.email,
                password: validatedData.password,
            },
        })

        return toUserResponse(user.id, user.username, user.email)
    }

    static async login(request: LoginUserRequest): Promise<UserResponse> {
        const validatedData = Validation.validate(UserValidation.LOGIN, request)

        const user = await prismaClient.users.findFirst({
            where: {
                email: validatedData.email,
            },
        })

        if (!user) {
            throw new ResponseError(400, "Invalid email or password!")
        }

        const passwordIsValid = await bcrypt.compare(
            validatedData.password,
            user.password
        )

        if (!passwordIsValid) {
            throw new ResponseError(400, "Invalid email or password!")
        }

        return toUserResponse(user.id, user.username, user.email)
    }

    // Get profile
    static async getProfile(userId: number): Promise<ProfileResponse> {
        const user = await prismaClient.users.findUnique({ where: { id: userId } })
        if (!user) throw new ResponseError(404, "User not found")

        return {
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            coin: user.coin,
            streak: user.streak,
            highestStreak: user.highestStreak,
            lastStreakDate: user.lastStreakDate ? user.lastStreakDate.toISOString() : null,
            budgetingPercentage: user.budgetingPercentage,
            activeThemeId: user.activeThemeId,
        }
    }

    // Update profile (name, username, email, password)
    static async updateProfile(userId: number, request: UpdateProfileRequest): Promise<ProfileResponse> {
        const data = Validation.validate(UserValidation.UPDATE_PROFILE, request)

        if (data.email) {
            const existing = await prismaClient.users.findFirst({ where: { email: data.email, NOT: { id: userId } } })
            if (existing) throw new ResponseError(400, "Email already in use")
        }

        if (data.username) {
            const existingUsername = await prismaClient.users.findFirst({ where: { username: data.username, NOT: { id: userId } } })
            if (existingUsername) throw new ResponseError(400, "Username already in use")
        }

        let hashed: string | undefined
        if (data.password) hashed = await bcrypt.hash(data.password, 10)

        const updated = await prismaClient.users.update({
            where: { id: userId },
            data: {
                ...(data.name !== undefined && { name: data.name }),
                ...(data.username !== undefined && { username: data.username }),
                ...(data.email !== undefined && { email: data.email }),
                ...(hashed !== undefined && { password: hashed }),
            },
        })

        return {
            id: updated.id,
            name: updated.name,
            username: updated.username,
            email: updated.email,
            coin: updated.coin,
            streak: updated.streak,
            highestStreak: updated.highestStreak,
            lastStreakDate: updated.lastStreakDate ? updated.lastStreakDate.toISOString() : null,
            budgetingPercentage: updated.budgetingPercentage,
            activeThemeId: updated.activeThemeId,
        }
    }

    // Update budgeting percentage
    static async updateBudgetingPercentage(userId: number, request: UpdateBudgetingPercentageRequest): Promise<ProfileResponse> {
        const data = Validation.validate(UserValidation.UPDATE_BUDGETING, request)

        const updated = await prismaClient.users.update({
            where: { id: userId },
            data: { budgetingPercentage: data.budgetingPercentage },
        })

        return {
            id: updated.id,
            name: updated.name,
            username: updated.username,
            email: updated.email,
            coin: updated.coin,
            streak: updated.streak,
            highestStreak: updated.highestStreak,
            lastStreakDate: updated.lastStreakDate ? updated.lastStreakDate.toISOString() : null,
            budgetingPercentage: updated.budgetingPercentage,
            activeThemeId: updated.activeThemeId,
        }
    }

    static async completeDailyStreak(userId: number, timezone = "UTC"): Promise<ProfileResponse> {
        // ambil user
        const user = await prismaClient.users.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                coin: true,
                streak: true,
                highestStreak: true,
                lastStreakDate: true,
                budgetingPercentage: true,
                activeThemeId: true,
            },
        })
        if (!user) throw new ResponseError(404, "User not found")

        // helper: format date-only di timezone sebagai 'YYYY-MM-DD'
        const fmt = (d: Date) =>
            new Intl.DateTimeFormat("en-CA", {
                timeZone: timezone,
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            }).format(d)

        const toDateStr = (d?: Date | null) => (d ? fmt(d) : null)
        const today = fmt(new Date())
        const yesterday = fmt(new Date(Date.now() - 24 * 60 * 60 * 1000))
        const last = toDateStr(user.lastStreakDate)

        if (last === today) throw new ResponseError(400, "Streak already updated today")

        let newStreak = 1
        let newHighest = user.highestStreak ?? 0

        if (last === yesterday) {
            newStreak = (user.streak ?? 0) + 1
            if (newStreak > newHighest) newHighest = newStreak
        } else {
            newStreak = 1
        }

        const updated = await prismaClient.users.update({
            where: { id: userId },
            data: {
                streak: newStreak,
                highestStreak: newHighest,
                lastStreakDate: new Date(),
            },
        })

        return {
            id: updated.id,
            name: updated.name,
            username: updated.username,
            email: updated.email,
            coin: updated.coin,
            streak: updated.streak,
            highestStreak: updated.highestStreak,
            lastStreakDate: updated.lastStreakDate ? updated.lastStreakDate.toISOString() : null,
            budgetingPercentage: updated.budgetingPercentage,
            activeThemeId: updated.activeThemeId,
        }
    }

    static async handleCourseCompletion(
        userId: number,
        coinDelta: number,
        claimStreak = false,
        timezone = "UTC"
    ): Promise<ProfileResponse> {
        if (coinDelta < 0) throw new ResponseError(400, "coinDelta must be >= 0")

        const result = await prismaClient.$transaction(async (tx) => {
            const user = await tx.users.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    name: true,
                    username: true,
                    email: true,
                    coin: true,
                    streak: true,
                    highestStreak: true,
                    lastStreakDate: true,
                    budgetingPercentage: true,
                    activeThemeId: true,
                },
            })
            if (!user) throw new ResponseError(404, "User not found")

            const fmt = (d: Date) =>
                new Intl.DateTimeFormat("en-CA", {
                    timeZone: timezone,
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                }).format(d)
            const toDateStr = (d?: Date | null) => (d ? fmt(d) : null)

            const updateData: any = { coin: { increment: coinDelta } }

            if (claimStreak) {
                const today = fmt(new Date())
                const yesterday = fmt(new Date(Date.now() - 24 * 60 * 60 * 1000))
                const last = toDateStr(user.lastStreakDate)

                if (last !== today) {
                    let newStreak = 1
                    let newHighest = user.highestStreak ?? 0
                    if (last === yesterday) {
                        newStreak = (user.streak ?? 0) + 1
                        if (newStreak > newHighest) newHighest = newStreak
                    } else {
                        newStreak = 1
                    }
                    updateData.streak = newStreak
                    updateData.highestStreak = newHighest
                    updateData.lastStreakDate = new Date()
                }
            }

            const updated = await tx.users.update({
                where: { id: userId },
                data: updateData,
            })

            return {
                id: updated.id,
                name: updated.name,
                username: updated.username,
                email: updated.email,
                coin: updated.coin,
                streak: updated.streak,
                highestStreak: updated.highestStreak,
                lastStreakDate: updated.lastStreakDate ? updated.lastStreakDate.toISOString() : null,
                budgetingPercentage: updated.budgetingPercentage,
                activeThemeId: updated.activeThemeId,
            } as ProfileResponse
        })

        return result
    }
}
