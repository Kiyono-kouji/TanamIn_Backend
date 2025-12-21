import { prismaClient } from "../utils/database-util"
import {
    CreateLevelRequest,
    LevelResponse,
    UpdateLevelRequest,
} from "../models/level-model"
import { LevelValidation } from "../validations/level-validation"
import { Validation } from "../validations/validation"
import { ResponseError } from "../error/response-error"

export class LevelService {
    static async create(request: CreateLevelRequest): Promise<LevelResponse> {
        const data = Validation.validate(LevelValidation.CREATE, request)
        const level = await prismaClient.levels.create({ data })
        return level
    }

    static async getByUser(userId: number): Promise<LevelResponse[]> {
        return prismaClient.levels.findMany({ where: { userId } })
    }

    static async getAll(): Promise<LevelResponse[]> {
        return prismaClient.levels.findMany()
    }

    static async update(request: UpdateLevelRequest, requestingUserId: number): Promise<LevelResponse> {
        const data = Validation.validate(LevelValidation.UPDATE, request)

        const existing = await prismaClient.levels.findUnique({ where: { id: data.id } })
        if (!existing) throw new ResponseError(404, "Level not found")
        if (existing.userId !== requestingUserId) throw new ResponseError(403, "Forbidden")

        const updateData: any = {
            ...(data.name !== undefined && { name: data.name }),
            ...(data.isCompleted !== undefined && { isCompleted: data.isCompleted }),
        }

        const updated = await prismaClient.levels.update({
            where: { id: data.id },
            data: updateData,
        })

        return updated
    }
}