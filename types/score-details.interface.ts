export interface PaymentHistoryTableData {
	connection: string;
	date: string;
	id: string;
	type: string;
	amount: number;
	onTime: boolean;
	daysLate: string;
	view: string;
}

export interface CreditAgeTableData {
	connection: string;
	type: string;
	id: string;
	openDate: string;
	closeDate: string;
	view: string;
}

export interface TotalCreditUtilizationData {
	connection: string;
	type: string;
	id: string;
	amount: string;
	balance: string;
	usage: number;
	view: string;
}

export interface TableColumnDef {
	id: string;
	label: string;
	hidden?: boolean;
}

export interface HeaderCell {
	label: string;
	hidden?: boolean;
}
