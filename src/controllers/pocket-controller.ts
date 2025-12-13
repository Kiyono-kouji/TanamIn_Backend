import { Request, Response, NextFunction } from "express"
import { PocketService } from "../services/pocket-service"

export class PocketController {
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await PocketService.create(req.body)
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
}