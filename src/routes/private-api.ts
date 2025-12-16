import express from "express"
import { authMiddleware } from "../middlewares/auth-middleware"
import { PocketController } from "../controllers/pocket-controller"
import { TransactionController } from "../controllers/transaction-controller"
import { ThemeController } from "../controllers/theme-controller"
import { UserController } from "../controllers/user-controller"
import { QuestionController } from "../controllers/question-controller"
import { LevelController } from "../controllers/level-controller"

export const privateRouter = express.Router()

// Protect all private routes
privateRouter.use(authMiddleware)

// Pocket routes
privateRouter.post("/pockets", PocketController.create)
privateRouter.get("/pockets/user/:userId", PocketController.getByUser)
privateRouter.patch("/pockets/:id", PocketController.update)

// Transaction routes
privateRouter.post("/transactions", TransactionController.create)
privateRouter.get("/transactions/pocket/:pocketId", TransactionController.getByPocket)

// privateRouter.patch("/transactions/:id", TransactionController.update)

// Question routes
privateRouter.post("/questions", QuestionController.create)
privateRouter.get("/questions/level/:levelId", QuestionController.getByLevel)
privateRouter.get("/questions", QuestionController.getAll)

// Level routes
privateRouter.post("/levels", LevelController.create)
privateRouter.get("/levels", LevelController.getAll)
privateRouter.put("/levels", LevelController.update)

privateRouter.put("/transactions", TransactionController.update)

// Theme routes
privateRouter.get("/themes", ThemeController.getByUser)
privateRouter.post("/themes/purchase", ThemeController.purchase)
privateRouter.post("/themes/active", ThemeController.activate)
privateRouter.get("/themes/active", ThemeController.getActive)

// User routes
privateRouter.get("/profile", UserController.getProfile)
privateRouter.put("/profile", UserController.updateProfile)
privateRouter.put("/profile/budgeting", UserController.updateBudgetingPercentage)
privateRouter.post("/profile/streak", UserController.completeStreak)