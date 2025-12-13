import { z, ZodType } from "zod"

export class ThemeValidation {
    static readonly PURCHASE: ZodType = z.object({
        themeId: z.number().positive({ message: "Theme ID must be positive" }),
    })

    static readonly SET_ACTIVE: ZodType = z.object({
        themeId: z.number().positive({ message: "Theme ID must be positive" }),
    })
}