import express from "express"
import { authMiddleware } from "../middlewares/auth-middleware"
import { PocketController } from "../controllers/pocket-controller"
import { QuestionController } from "../controllers/question-controller"
import { LevelController } from "../controllers/level-controller"

export const privateRouter = express.Router()

// Protect all private routes
privateRouter.use(authMiddleware)

// Pocket routes
privateRouter.post("/pockets", PocketController.create)
privateRouter.get("/pockets/user/:userId", PocketController.getByUser)
privateRouter.put("/pockets", PocketController.update)
privateRouter.delete("/pockets/:id", PocketController.delete)

// Question routes (private because questions are tied to levels/user context)
privateRouter.post("/questions", QuestionController.create)
privateRouter.get("/questions/level/:levelId", QuestionController.getByLevel)
privateRouter.get("/questions", QuestionController.getAll)

// Level routes (private; levels are user-specific and can be updated)
privateRouter.post("/levels", LevelController.create)
privateRouter.get("/levels/user/:userId", LevelController.getByUser)
privateRouter.get("/levels", LevelController.getAll)
privateRouter.put("/levels", LevelController.update)