import { z, ZodType } from "zod"

export class ProfileValidation {
    // Update profile: all fields optional but require at least one provided
    static readonly UPDATE_PROFILE: ZodType = z
        .object({
            name: z.string().min(1, { message: "Name must not be empty" }).optional(),
            username: z.string().min(1, { message: "Username must not be empty" }).optional(),
            email: z.string().email({ message: "Invalid email format" }).optional(),
            password: z.string().min(8, { message: "Password must be at least 8 characters" }).optional(),
        })
        .refine((obj) => Object.values(obj).some((v) => v !== undefined), {
            message: "At least one field must be provided for update",
        })

    // Update budgeting percentage: integer between 0 and 100
    static readonly UPDATE_BUDGETING: ZodType = z.object({
        budgetingPercentage: z
            .number()
            .int({ message: "Budgeting percentage must be an integer" })
            .min(0, { message: "Budgeting percentage must be at least 0" })
            .max(100, { message: "Budgeting percentage must be at most 100" }),
    })
}