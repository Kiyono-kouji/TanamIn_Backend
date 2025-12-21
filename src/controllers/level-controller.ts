import { Request, Response, NextFunction } from "express"
import { LevelService } from "../services/level-service"
import {
    CreateLevelRequest,
    UpdateLevelRequest,
    LevelResponse,
} from "../models/level-model"

export class LevelController {
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const request = req.body as CreateLevelRequest
            const response: LevelResponse = await LevelService.create(request)
            res.status(201).json({ data: response })
        } catch (error) {
            next(error)
        }
    }

    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id
            const response: LevelResponse[] = await LevelService.getByUser(userId)
            res.status(200).json({ data: response })
        } catch (error) {
            next(error)
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id)
            if (Number.isNaN(id)) return res.status(400).json({ errors: "Invalid level id" })
            const userId = (req as any).user?.id
            if (!userId) return res.status(401).json({ errors: "Unauthorized" })
            const request = { id, ...(req.body || {}) } as UpdateLevelRequest
            const response: LevelResponse = await LevelService.update(request, userId)
            res.status(200).json({ data: response })
        } catch (error) {
            next(error)
        }
    }
}