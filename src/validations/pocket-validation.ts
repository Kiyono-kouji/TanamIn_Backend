import { z, ZodType } from "zod"

export class PocketValidation {
    static readonly CREATE: ZodType = z.object({
        name: z.string().min(1, { message: "Name is required" }),
        walletType: z.string().min(1, { message: "Wallet type is required" }),
        userId: z.number(),
        total: z.number().optional(),
        isActive: z.boolean().optional(),
    })

    static readonly UPDATE: ZodType = z.object({
        id: z.number(),
        name: z.string().optional(),
        walletType: z.string().optional(),
        isActive: z.boolean().optional(),
        total: z.number().optional(),
    })
}