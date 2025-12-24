import { prismaClient } from "../utils/database-util"
import { TransactionResponse, CreateTransactionRequest, UpdateTransactionRequest } from "../models/transaction-model"
import { Validation } from "../validations/validation"
import { ResponseError } from "../error/response-error"
import { TransactionValidation } from "../validations/transaction-validation"
import { DateTime } from "luxon" // Add this import at the top

export class TransactionService {
    static async create(request: CreateTransactionRequest): Promise<TransactionResponse> {
        const data = Validation.validate(TransactionValidation.CREATE, request)

        // Always use Asia/Jakarta (GMT+7) for the date
        let dateObj: Date
        if (data.date) {
            if (typeof data.date === "string") {
                dateObj = DateTime.fromISO(data.date, { zone: "Asia/Jakarta" }).toJSDate()
            } else {
                // If it's already a Date, just use it
                dateObj = DateTime.fromJSDate(data.date, { zone: "Asia/Jakarta" }).toJSDate()
            }
        } else {
            dateObj = DateTime.now().setZone("Asia/Jakarta").toJSDate()
        }

        try {
            const transaction = await prismaClient.transactions.create({
                data: {
                    date: dateObj,
                    name: data.name,
                    pricePerUnit: data.pricePerUnit,
                    action: data.action,
                    nominal: data.nominal,
                    unitAmount: data.unitAmount,
                    pocket: { connect: { id: data.pocketId } },
                    toPocket: data.toPocketId ? { connect: { id: data.toPocketId } } : undefined,
                },
            })
            return transaction
        } catch (error) {
            console.error("Error creating transaction:", error)
            throw error
        }
    }

    static async getByPocket(pocketId: number): Promise<TransactionResponse[]> {
        return prismaClient.transactions.findMany({
            where: { pocketId },
            orderBy: { date: "desc" }
        })
    }

    static async update(request: UpdateTransactionRequest): Promise<TransactionResponse> {
        const data = Validation.validate(TransactionValidation.UPDATE, request)
        const updateData: any = {
            ...(data.date !== undefined && { date: data.date }),
            ...(data.name !== undefined && { name: data.name }),
            ...(data.pricePerUnit !== undefined && { pricePerUnit: data.pricePerUnit }),
            ...(data.action !== undefined && { action: data.action }),
            ...(data.nominal !== undefined && { nominal: data.nominal }),
            ...(data.unitAmount !== undefined && { unitAmount: data.unitAmount }),
            ...(data.pocketId !== undefined && { pocket: { connect: { id: data.pocketId } } }),
            ...(data.toPocketId !== undefined && { toPocket: data.toPocketId ? { connect: { id: data.toPocketId } } : { disconnect: true } }),
        }
        const transaction = await prismaClient.transactions.update({
            where: { id: data.id },
            data: updateData,
        })
        return transaction
    }

    static async delete(id: number): Promise<void> {
        await prismaClient.transactions.delete({ where: { id } })
    }
}