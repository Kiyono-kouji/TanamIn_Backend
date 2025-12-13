import { z, ZodType } from "zod"

export class UserValidation {
    static readonly REGISTER: ZodType = z.object({
        name: z.string().min(1, { error: "Name can not be empty!" }),
        username: z
            .string({ error: "Username must be string!" })
            .min(1, { error: "Username can not be empty!" }),
        email: z
            .email({ error: "Email format is invalid!" })
            .min(1, { error: "Email can not be empty!" }),
        password: z
            .string({ error: "Password must be string!" })
            .min(8, { error: "Password must contain more than or equal to 8 characters!" }),
    })

    static readonly LOGIN: ZodType = z.object({
        email: z
            .email({
                error: "Email format is invalid!",
            })
            .min(1, {
                error: "Email can not be empty!",
            }),
        password: z
            .string({
                error: "Password must be string!",
            })
            .min(8, {
                error: "Password must contain more than or equal to 8 characters!",
            }),
    })

    static readonly UPDATE_PROFILE: ZodType = z.object({
        name: z.string().min(1, { error: "Name can not be empty!" }).optional(),
        username: z
            .string({ error: "Username must be string!" })
            .min(1, { error: "Username can not be empty!" })
            .optional(),
        email: z
            .email({ error: "Email format is invalid!" })
            .min(1, { error: "Email can not be empty!" })
            .optional(),
        password: z
            .string({ error: "Password must be string!" })
            .min(8, { error: "Password must contain more than or equal to 8 characters!" })
            .optional(),
    })

    static readonly UPDATE_BUDGETING: ZodType = z.object({
        budgetingPercentage: z
            .number({ error: "Budgeting percentage must be a number!" })
            .min(0, { error: "Budgeting percentage must be at least 0!" })
            .max(100, { error: "Budgeting percentage cannot exceed 100!" }),
    })
}
