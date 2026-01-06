import { Request, Response, NextFunction } from "express"
import {
    LoginUserRequest,
    RegisterUserRequest,
    UserResponse,
} from "../models/user-model"
import { ResponseError } from "../error/response-error"
import { UserService } from "../services/user-service"

export class UserController {
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const request: RegisterUserRequest = req.body as RegisterUserRequest
            const response: UserResponse = await UserService.register(request)

            res.status(200).json({
                data: response,
            })
        } catch (error) {
            next(error)
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const request: LoginUserRequest = req.body as LoginUserRequest
            const response: UserResponse = await UserService.login(request)

            res.status(200).json({
                data: response,
            })
        } catch (error) {
            next(error)
        }
    }

    static async getProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id
            const response = await UserService.getProfile(userId)
            res.status(200).json({ data: response })
        } catch (error) {
            next(error)
        }
    }

    static async updateProfile(req: Request, res: Response, next: NextFunction) {
        try {
            if (!(req as any).user) {
                throw new ResponseError(401, "Unauthorized")
            }
            const userId = (req as any).user.id
            const response = await UserService.updateProfile(userId, req.body)
            res.status(200).json({ data: response })
        } catch (error) {
            next(error)
        }
    }

    static async updateBudgetingPercentage(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id
            const response = await UserService.updateBudgetingPercentage(userId, req.body)
            res.status(200).json({ data: response })
        } catch (error) {
            next(error)
        }
    }

    static async completeStreak(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id
            const timezone = (req.body?.timezone as string) ?? (req.headers["x-timezone"] as string) ?? "UTC"
            const response = await UserService.completeDailyStreak(userId, timezone)
            res.status(200).json({ data: response })
        } catch (error) {
            next(error)
        }
    }

    static async courseComplete(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id
            const { coinDelta, claimStreak, timezone } = req.body as {
                coinDelta?: number
                claimStreak?: boolean
                timezone?: string
            }
            const profile = await UserService.handleCourseCompletion(userId, coinDelta ?? 0, !!claimStreak, timezone)
            res.status(200).json({ data: profile })
        } catch (error) {
            next(error)
        }
    }
}
