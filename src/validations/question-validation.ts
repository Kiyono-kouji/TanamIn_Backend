import { z, ZodType } from "zod"

export class QuestionValidation {
    static readonly CREATE: ZodType = z
        .object({
            question: z.string().min(1, { message: "Question is required" }),
            option1: z.string().min(1, { message: "Option1 is required" }),
            option2: z.string().min(1, { message: "Option2 is required" }),
            option3: z.string().min(1, { message: "Option3 is required" }),
            option4: z.string().min(1, { message: "Option4 is required" }),
            answer: z.string().min(1, { message: "Answer is required" }),
            levelId: z.number(),
        })
        .refine(
            (data) => {
                const options = [data.option1, data.option2, data.option3, data.option4]
                return options.includes(data.answer)
            },
            { message: "Answer must be one of the provided options" }
        )
}