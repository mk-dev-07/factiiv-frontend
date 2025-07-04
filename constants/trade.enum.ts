export enum TradeType {
	BORROW = "borrow",
	BUYSELL = "buysell",
}

export enum TradeRole {
	LENDER = "lender",
	BORROWER = "borrower",
	SELLER = "seller",
	BUYER = "buyer",
}

export enum TradeStatus {
	PENDING,
	COMPLETE,
	LATE,
}

export enum ActivityType {
	PAYMENT = "payment",
	CHARGE = "charge",
	COLLECTIONS = "collections",
	CHARGEOFF = "chargeoff",
}