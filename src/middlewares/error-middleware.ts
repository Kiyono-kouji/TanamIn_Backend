import { Request, Response, NextFunction } from "express"
import { ZodError } from "zod"
import { ResponseError } from "../error/response-error"

export const errorMiddleware = async (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (error instanceof ZodError) {
        res.status(400).json({
            errors: `Validation error: ${JSON.stringify(error.message)}`,
        })
    } else if (error instanceof ResponseError) {
        res.status(error.status).json({
            errors: error.message,
        })
    } else if ((error as any).code && (error as any).code.startsWith('P2')) {
        // Handle Prisma Errors (e.g. P2002 Unique Constraint, P2025 Record Not Found)
        console.error("Prisma Error:", error)
        res.status(400).json({
            errors: `Database error: ${(error as any).message || "Unknown constraints"}`,
        })
    } else {
        console.error(error) // Log the actual 500 error
        res.status(500).json({
            errors: error.message,
        })
    }
}