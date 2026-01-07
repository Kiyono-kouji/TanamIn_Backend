import { Request, Response, NextFunction } from "express"
import { PocketService } from "../services/pocket-service"
import { DateTime } from "luxon"

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

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user?.id
            if (!userId) return res.status(401).json({ errors: "Unauthorized" })
            
            const pocketId = Number(req.params.id)
            if (Number.isNaN(pocketId)) return res.status(400).json({ errors: "Invalid pocket id" })
            
            const response = await PocketService.delete(userId, pocketId)
            res.status(200).json({ 
                data: response,
                message: "Pocket deleted successfully" 
            })
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
            // Format date to ISO string in Asia/Jakarta (GMT+7)
            const formatted = result.data.map(tx => ({
                ...tx,
                date: DateTime.fromJSDate(new Date(tx.date)).setZone("Asia/Jakarta").toISO()
            }))
            res.status(200).json({ data: formatted, meta: result.meta })
        } catch (error) {
            next(error)
        }
    }
}