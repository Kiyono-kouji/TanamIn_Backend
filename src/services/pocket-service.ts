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
        
        // Validasi: hanya bisa create dengan walletType "Main"
        if (data.walletType !== "Main") {
            throw new ResponseError(400, "Only Main wallet type is allowed for user-created pockets")
        }
        
        // Validasi: Cegah user create pocket bernama "Kebutuhan"
        if (data.name.trim().toLowerCase() === "kebutuhan") {
            throw new ResponseError(400, "Pocket 'Kebutuhan' already exists by default. Please use another name.")
        }
        
        const pocket = await prismaClient.pockets.create({ data })
        return pocket
    }

    static async getByUser(userId: number): Promise<PocketResponse[]> {
        return prismaClient.pockets.findMany({ where: { userId } })
    }

    static async update(request: UpdatePocketRequest): Promise<PocketResponse> {
        const data = Validation.validate(PocketValidation.UPDATE, request)
        
        // CEK APAKAH POCKET EXIST DAN AMBIL DATA
        const pocket = await prismaClient.pockets.findUnique({ where: { id: data.id } })
        if (!pocket) throw new ResponseError(404, "Pocket not found")
        
        // 👇 PROTEKSI: Cegah update NAMA untuk pocket Investment wallet
        if (data.name !== undefined && pocket.walletType === "Investment") {
            throw new ResponseError(400, "Cannot update name of Investment wallet pockets")
        }
        
        // 👇 PROTEKSI: Cegah update NAMA untuk pocket "Kebutuhan" di Main wallet
        if (data.name !== undefined && pocket.walletType === "Main" && pocket.name.trim().toLowerCase() === "kebutuhan") {
            throw new ResponseError(400, "Cannot update name of default pocket 'Kebutuhan'")
        }
        
        // 👇 PROTEKSI: Cegah user mengubah nama pocket lain menjadi "Kebutuhan"
        if (data.name !== undefined && data.name.trim().toLowerCase() === "kebutuhan") {
            throw new ResponseError(400, "Pocket 'Kebutuhan' already exists by default. Please use another name.")
        }
        
        const updateData: any = {
            ...(data.name !== undefined && { name: data.name }),
            ...(data.walletType !== undefined && { walletType: data.walletType }),
            ...(data.isActive !== undefined && { isActive: data.isActive }),
            ...(data.total !== undefined && { total: data.total }),
        }
        const updated = await prismaClient.pockets.update({
            where: { id: data.id },
            data: updateData,
        })
        return updated
    }

    static async delete(userId: number, pocketId: number): Promise<PocketResponse> {
        // Cek apakah pocket exist dan milik user
        const pocket = await prismaClient.pockets.findUnique({ where: { id: pocketId } })
        if (!pocket) throw new ResponseError(404, "Pocket not found")
        if (pocket.userId !== userId) throw new ResponseError(403, "Forbidden")
        
        // PROTEKSI: Cegah delete pocket Investment wallet
        if (pocket.walletType === "Investment") {
            throw new ResponseError(400, "Cannot delete Investment wallet pockets")
        }
        
        // PROTEKSI: Cegah delete pocket "Kebutuhan" di Main wallet
        if (pocket.walletType === "Main" && pocket.name.trim().toLowerCase() === "kebutuhan") {
            throw new ResponseError(400, "Cannot delete default pocket 'Kebutuhan'")
        }
        
        // 4. Soft delete: update isActive = false
        const deleted = await prismaClient.pockets.update({
            where: { id: pocketId },
            data: { isActive: false }
        })
        
        return deleted
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
                    toPocketId: true
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