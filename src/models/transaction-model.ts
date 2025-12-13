export interface CreateTransactionRequest {
    date: Date | string
    name: string
    pricePerUnit: number
    action: string
    nominal: number
    unitAmount: number
    pocketId: number
    toPocketId?: number
}

export interface UpdateTransactionRequest {
    id: number
    date?: Date | string
    name?: string
    pricePerUnit?: number
    action?: string
    nominal?: number
    unitAmount?: number
    pocketId?: number
    toPocketId?: number
}

export interface TransactionResponse {
    id: number
    date: Date
    name: string
    pricePerUnit: number
    action: string
    nominal: number
    unitAmount: number
    pocketId: number
    toPocketId?: number | null
}