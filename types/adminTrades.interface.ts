export interface IAdminTrades {
    tradeId: string,
    reportingBusiness?: string,
    receivingBusiness?: string,
    balance?: string,
    total?: string,
    type: string,
    activityCard?: boolean,
    date?: Date,
    status?: "accepted" | "rejected" | "pending"
}