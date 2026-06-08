import { PackageResponse, PurchasePremiumRequest, TransactionResponse } from "@/types"
import api, { handleError } from "./config"

export const purchasePremium = async (req: PurchasePremiumRequest): Promise<TransactionResponse> => {
    try {
        const res = await api.post("/payments/purchase", req)
        return res.data.data as TransactionResponse
    } catch (error) {
        handleError(error)
        throw error
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const confirmPayment = async (params: Record<string, any>) => {
    try {
        await api.get(`payments/vnp-return`, { params })
    } catch (error) {
        handleError(error)
        throw error
    }
}

export const getPackages = async (): Promise<PackageResponse[]> => {
    try {
        const res = await api.get('/payments/packages')
        return res.data.data as PackageResponse[]
    } catch (error) {
        handleError(error)
        throw error
    }
}

export const getMyTransactions = async (): Promise<TransactionResponse[]> => {
    try {
        const params = {
            page: 1,
            limit: 10,
        }
        const res = await api.get('/payments/history', { params })
        return res.data.data as TransactionResponse[]
    } catch (error) {
        handleError(error)
        throw error
    }
}