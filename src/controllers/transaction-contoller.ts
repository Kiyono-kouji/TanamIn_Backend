import { Request, Response, NextFunction } from "express"
import { TransactionService } from "../services/transaction-service"

export class TransactionController {
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await TransactionService.create(req.body)
            res.status(201).json({ data: response })
        } catch (error) {
            next(error)
        }
    }

    static async getByPocket(req: Request, res: Response, next: NextFunction) {
        try {
            const pocketId = Number(req.params.pocketId)
            const data = await TransactionService.getByPocket(pocketId)
            res.status(200).json({ data })
        } catch (error) {
            next(error)
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id)
            const response = await TransactionService.update({ ...req.body, id })
            res.status(200).json({ data: response })
        } catch (error) {
            next(error)
        }
    }
}