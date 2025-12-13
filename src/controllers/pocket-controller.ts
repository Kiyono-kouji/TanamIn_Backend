import { Request, Response, NextFunction } from "express"
import { PocketService } from "../services/pocket-service"

export class PocketController {
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id
            const response = await PocketService.create({
                ...req.body,
                userId
            })
            res.status(201).json({ data: response })
        } catch (error) {
            next(error)
        }
    }

    static async getByUser(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = Number(req.params.userId)
            const response = await PocketService.getByUser(userId)
            res.status(200).json({ data: response })
        } catch (error) {
            next(error)
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id)
            const response = await PocketService.update({ ...req.body, id })
            res.status(200).json({ data: response })
        } catch (error) {
            next(error)
        }
    }

    static async history(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user?.id
            if (!userId) return res.status(401).json({ errors: "Unauthorized" })

            const pocketId = Number(req.params.id)
            if (Number.isNaN(pocketId)) return res.status(400).json({ errors: "Invalid pocket id" })

            const page = Math.max(1, Number(req.query.page ?? 1))
            const limit = Math.max(1, Math.min(100, Number(req.query.limit ?? 20)))

            const result = await PocketService.getHistory(userId, pocketId, page, limit)
            res.status(200).json({ data: result.data, meta: result.meta })
        } catch (error) {
            next(error)
        }
    }
}