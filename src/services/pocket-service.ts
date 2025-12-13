import { prismaClient } from "../utils/database-util"
import { PocketResponse, CreatePocketRequest, UpdatePocketRequest } from "../models/pocket-model"
import { PocketValidation } from "../validations/pocket-validation"
import { Validation } from "../validations/validation"
import { ResponseError } from "../error/response-error"

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
}