import express from "express"
import { authMiddleware } from "../middlewares/auth-middleware"
import { PocketController } from "../controllers/pocket-controller"
import { TransactionController } from "../controllers/transaction-contoller"
import { ThemeController } from "../controllers/theme-controller"
import { UserController } from "../controllers/user-controller"

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

privateRouter.put("/transactions", TransactionController.update)

// Theme routes
privateRouter.get("/themes", ThemeController.getAllThemes)
privateRouter.post("/themes/purchase", ThemeController.purchaseTheme)
privateRouter.post("/themes/active", ThemeController.setActiveTheme)
privateRouter.get("/themes/active", ThemeController.getActiveTheme)

// User routes
privateRouter.get("/profile", UserController.getProfile)
privateRouter.put("/profile", UserController.updateProfile)
privateRouter.put("/profile/budgeting", UserController.updateBudgetingPercentage)
