export interface Pocket {
    id: number
    name: string
    total: number
    walletType: string
    isActive: boolean
    userId: number
}

export interface CreatePocketRequest {
    name: string
    walletType: string
    userId: number
    total?: number
    isActive?: boolean
}

export interface UpdatePocketRequest {
    id: number
    name?: string
    walletType?: string
    isActive?: boolean
    total?: number
}

export interface PocketResponse {
    id: number
    name: string
    total: number
    walletType: string
    isActive: boolean
    userId: number
}