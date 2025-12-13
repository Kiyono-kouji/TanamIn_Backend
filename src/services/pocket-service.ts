import { prismaClient } from "../utils/database-util"
import { PocketResponse, CreatePocketRequest, UpdatePocketRequest } from "../models/pocket-model"
import { PocketValidation } from "../validations/pocket-validation"
import { Validation } from "../validations/validation"
import { ResponseError } from "../error/response-error"

export interface PocketTransaction {
    id: number
    date: Date
    name: string | null
    pricePerUnit?: number | null
    action?: string | null
    nominal?: number | null
    unitAmount?: number | null
    pocketId?: number | null
    toPocketId?: number | null
    createdAt?: Date
    updatedAt?: Date
}

export interface PagedResult<T> {
    data: T[]
    meta: {
        page: number
        limit: number
        total: number
    }
}

export class PocketService {
    static async create(request: CreatePocketRequest): Promise<PocketResponse> {
        const data = Validation.validate(PocketValidation.CREATE, request)
        const pocket = await prismaClient.pockets.create({ data })
        return pocket
    }

    static async getByUser(userId: number): Promise<PocketResponse[]> {
        return prismaClient.pockets.findMany({ where: { userId } })
    }

    static async update(request: UpdatePocketRequest): Promise<PocketResponse> {
        const data = Validation.validate(PocketValidation.UPDATE, request)
        const updateData: any = {
            ...(data.name !== undefined && { name: data.name }),
            ...(data.walletType !== undefined && { walletType: data.walletType }),
            ...(data.isActive !== undefined && { isActive: data.isActive }),
            ...(data.total !== undefined && { total: data.total }),
        }
        const pocket = await prismaClient.pockets.update({
            where: { id: data.id },
            data: updateData,
        })
        return pocket
    }

    static async delete(id: number): Promise<void> {
        await prismaClient.pockets.delete({ where: { id } })
    }

    /**
     * Returns paged transaction history for a pocket.
     * - includes transactions where pocket is source (pocketId) OR destination (toPocketId)
     * - ensures requesting user owns the pocket (per ERD: pockets.userId)
     */
    static async getHistory(userId: number, pocketId: number, page = 1, limit = 20): Promise<PagedResult<PocketTransaction>> {
        const pocket = await prismaClient.pockets.findUnique({ where: { id: pocketId } })
        if (!pocket) throw new ResponseError(404, "Pocket not found")
        if (pocket.userId !== userId) throw new ResponseError(403, "Forbidden")

        const where = {
            OR: [
                { pocketId },
                { toPocketId: pocketId }
            ]
        }

        const skip = Math.max(0, (page - 1) * limit)

        const [transactions, total] = await prismaClient.$transaction([
            prismaClient.transactions.findMany({
                where,
                orderBy: { date: "desc" },
                skip,
                take: limit,
                select: {
                    id: true,
                    date: true,
                    name: true,
                    pricePerUnit: true,
                    action: true,
                    nominal: true,
                    unitAmount: true,
                    pocketId: true,
                    toPocketId: true,
                    createdAt: true,
                    updatedAt: true
                }
            }),
            prismaClient.transactions.count({ where })
        ])

        return {
            data: transactions as PocketTransaction[],
            meta: { page, limit, total }
        }
    }
}