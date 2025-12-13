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
}
