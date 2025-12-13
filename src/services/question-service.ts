import { prismaClient } from "../utils/database-util"
import { CreateQuestionRequest, QuestionResponse } from "../models/question-model"
import { QuestionValidation } from "../validations/question-validation"
import { Validation } from "../validations/validation"
import { ResponseError } from "../error/response-error"

export class QuestionService {
    static async create(request: CreateQuestionRequest): Promise<QuestionResponse> {
        const data = Validation.validate(QuestionValidation.CREATE, request)

        const level = await prismaClient.levels.findUnique({ where: { id: data.levelId } })
        if (!level) {
            throw new ResponseError(400, "Level not found")
        }

        const question = await prismaClient.questions.create({ data })
        return question
    }

    static async getByLevel(levelId: number): Promise<QuestionResponse[]> {
        return prismaClient.questions.findMany({ where: { levelId } })
    }

    static async getAll(): Promise<QuestionResponse[]> {
        return prismaClient.questions.findMany()
    }
}