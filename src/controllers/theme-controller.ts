import { Request, Response, NextFunction } from "express"
import { ThemeService } from "../services/theme-service"

export class ThemeController {
    static async getAllThemes(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id
            const response = await ThemeService.getAllThemes(userId)
            res.status(200).json({ data: response })
        } catch (error) {
            next(error)
        }
    }

    static async purchaseTheme(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id
            const response = await ThemeService.purchaseTheme(userId, req.body)
            res.status(200).json({ data: response })
        } catch (error) {
            next(error)
        }
    }

    static async setActiveTheme(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id
            const response = await ThemeService.setActiveTheme(userId, req.body)
            res.status(200).json({ data: response })
        } catch (error) {
            next(error)
        }
    }

    static async getActiveTheme(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id
            const response = await ThemeService.getActiveTheme(userId)
            res.status(200).json({ data: response })
        } catch (error) {
            next(error)
        }
    }
}