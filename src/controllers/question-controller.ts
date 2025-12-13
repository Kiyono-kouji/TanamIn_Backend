import { Request, Response, NextFunction } from "express"
import { QuestionService } from "../services/question-service"
import { CreateQuestionRequest, QuestionResponse } from "../models/question-model"

export class QuestionController {
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const request = req.body as CreateQuestionRequest
            const response: QuestionResponse = await QuestionService.create(request)
            res.status(201).json({ data: response })
        } catch (error) {
            next(error)
        }
    }

    static async getByLevel(req: Request, res: Response, next: NextFunction) {
        try {
            const levelId = Number(req.params.levelId)
            const response: QuestionResponse[] = await QuestionService.getByLevel(levelId)
            res.status(200).json({ data: response })
        } catch (error) {
            next(error)
        }
    }

    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const response: QuestionResponse[] = await QuestionService.getAll()
            res.status(200).json({ data: response })
        } catch (error) {
            next(error)
        }
    }
}