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

export const confirmPayment = async (transId: string) => {
    try {
        await api.post(`payments/complete/${transId}`)
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