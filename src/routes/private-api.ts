import express from "express"
import { authMiddleware } from "../middlewares/auth-middleware"
import { PocketController } from "../controllers/pocket-controller"
import { QuestionController } from "../controllers/question-controller"
import { LevelController } from "../controllers/level-controller"
import { UserController } from "../controllers/user-controller"

export const privateRouter = express.Router()

// Protect all private routes
privateRouter.use(authMiddleware)

// Profile/User routes
privateRouter.post("/profile/streak", UserController.completeStreak)

// Pocket routes
privateRouter.post("/pockets", PocketController.create)
privateRouter.get("/pockets/user/:userId", PocketController.getByUser)
privateRouter.put("/pockets", PocketController.update)
privateRouter.delete("/pockets/:id", PocketController.delete)

// Question routes
privateRouter.post("/questions", QuestionController.create)
privateRouter.get("/questions/level/:levelId", QuestionController.getByLevel)
privateRouter.get("/questions", QuestionController.getAll)

// Level routes
privateRouter.post("/levels", LevelController.create)
privateRouter.get("/levels/user/:userId", LevelController.getByUser)
privateRouter.get("/levels", LevelController.getAll)
privateRouter.put("/levels", LevelController.update)