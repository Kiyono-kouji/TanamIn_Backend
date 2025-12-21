import { z, ZodType } from "zod"

export class LevelValidation {
    static readonly CREATE: ZodType = z.object({
        name: z.string().min(1, { message: "Name is required" }),
        userId: z.number(),
    })

    static readonly UPDATE: ZodType = z.object({
        id: z.number(),
        name: z.string().optional(),
        isCompleted: z.boolean().optional(),
        userId: z.number().optional(),
    })
}