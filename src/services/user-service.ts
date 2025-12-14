import { ResponseError } from "../error/response-error"
import {
    LoginUserRequest,
    RegisterUserRequest,
    toUserResponse,
    UserResponse,
    ProfileResponse,
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
}
