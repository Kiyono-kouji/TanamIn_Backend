import { NextFunction, Response } from "express"
import { UserRequest } from "../models/user-request-model"
import { ResponseError } from "../error/response-error"
import { verifyToken } from "../utils/jwt-util"

export const authMiddleware = (
    req: UserRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers["authorization"]

        if (!authHeader || Array.isArray(authHeader) || typeof authHeader !== "string") {
            return next(new ResponseError(401, "Unauthorized user!"))
        }

        const parts = authHeader.split(" ")
        if (parts.length !== 2 || parts[0] !== "Bearer" || !parts[1]) {
            return next(new ResponseError(401, "Unauthorized user!"))
        }

        const payload = verifyToken(parts[1])
        req.user = payload

        return next()
    } catch (error) {
        next(error)
    }
}