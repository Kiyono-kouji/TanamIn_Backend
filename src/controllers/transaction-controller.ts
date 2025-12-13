import { Request, Response, NextFunction } from "express"
import { TransactionService } from "../services/transaction-service"

function parsePositiveInt(value: any): number | null {
    const n = Number(value)
    if (!Number.isFinite(n)) return null
    const i = Math.trunc(n)
    return i > 0 ? i : null
}

export class TransactionController {
    // Example: GET /api/transactions/pocket/:pocketId?page=1&limit=20
    static async getByPocket(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user?.id
            if (!userId) return res.status(401).json({ errors: "Unauthorized" })

            const pocketId = parsePositiveInt(req.params.pocketId)
            if (pocketId === null) return res.status(400).json({ errors: "Invalid pocket id" })

            const page = (() => {
                const p = parsePositiveInt(req.query.page ?? 1)
                return p === null ? 1 : p
            })()

            const limit = (() => {
                const l = parsePositiveInt(req.query.limit ?? 20)
                return l === null ? 20 : Math.min(100, l)
            })()

            const result = await TransactionService.getByPocket(userId, pocketId, page, limit)
            res.status(200).json({ data: result.data, meta: result.meta })
        } catch (error) {
            next(error)
        }
    }

    // other transaction controller methods...
}   