export interface TradeStatus {
  tradeId: string;
  status: "ACCEPTED" | "REJECTED";
  notificationId: string;
}
