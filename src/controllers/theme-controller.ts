import { Request, Response, NextFunction } from "express"
import { ThemeService } from "../services/theme-service"

export class ThemeController {
    static async getByUser(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id
            const response = await ThemeService.getByUser(userId)
            res.status(200).json({ data: response })
        } catch (error) {
            next(error)
        }
    }

    static async purchase(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id
            const response = await ThemeService.purchase(userId, req.body)
            res.status(200).json({ data: response })
        } catch (error) {
            next(error)
        }
    }

    static async activate(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id
            const response = await ThemeService.activate(userId, req.body)
            res.status(200).json({ data: response })
        } catch (error) {
            next(error)
        }
    }

    static async getActive(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id
            const response = await ThemeService.getActive(userId)
            res.status(200).json({ data: response })
        } catch (error) {
            next(error)
        }
    }
}