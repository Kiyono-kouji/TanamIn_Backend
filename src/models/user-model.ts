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
