import { z, ZodType } from "zod"

export class TransactionValidation {
    static readonly CREATE: ZodType = z.object({
        date: z.union([z.string(), z.date()]).optional(),
        name: z.string().min(1, { message: "Name is required" }),
        pricePerUnit: z.number(),
        action: z.string().min(1, { message: "Action is required" }),
        nominal: z.number(),
        unitAmount: z.number(),
        pocketId: z.number(),
        toPocketId: z.number().optional(),
    })

    static readonly UPDATE: ZodType = z.object({
        id: z.number(),
        date: z.union([z.string(), z.date()]).optional(),
        name: z.string().optional(),
        pricePerUnit: z.number().optional(),
        action: z.string().optional(),
        nominal: z.number().optional(),
        unitAmount: z.number().optional(),
        pocketId: z.number().optional(),
        toPocketId: z.number().optional(),
    })
}