import { string } from "zod"
import { generateToken } from "../utils/jwt-util"

export interface UserJWTPayload {
    id: number
    username: string
    email: string
}

export interface RegisterUserRequest {
    name: string
    username: string
    email: string
    password: string
}

export interface LoginUserRequest {
    email: string
    password: string
}

export interface UserResponse {
    id: number
    username: string
    email: string
    token?: string
}

export interface ProfileResponse {
    id: number
    name: string
    username: string
    email: string
    coin: number
    streak: number
    highestStreak: number
    lastStreakDate: string | null
    budgetingPercentage: number
    activeThemeId: number
}

export interface UpdateProfileRequest {
    name?: string
    username?: string
    email?: string
    password?: string
}

export interface UpdateBudgetingPercentageRequest {
    budgetingPercentage: number
}

export function toUserResponse(
    id: number,
    username: string,
    email: string
): UserResponse {
    return {
        id,
        username,
        email,
        token: generateToken(
            {
                id,
                username,
                email,
            },
            "1h"
        ),
    }
}
