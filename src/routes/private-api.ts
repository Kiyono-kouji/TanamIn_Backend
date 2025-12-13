import express from "express"
import { authMiddleware } from "../middlewares/auth-middleware"
import { PocketController } from "../controllers/pocket-controller"
import { TransactionController } from "../controllers/transaction-contoller"

export const privateRouter = express.Router()

// Protect all private routes
privateRouter.use(authMiddleware)

// Pocket routes
privateRouter.post("/pockets", PocketController.create)
privateRouter.get("/pockets/user/:userId", PocketController.getByUser)
privateRouter.put("/pockets", PocketController.update)

// Transaction routes
privateRouter.post("/transactions", TransactionController.create)
privateRouter.get("/transactions/pocket/:pocketId", TransactionController.getByPocket)
privateRouter.put("/transactions", TransactionController.update)