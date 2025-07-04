export interface ConnectionResponse {
	payload: Connection[];
}

export interface Connection {
	id: string;
	toProfileId: string;
	createdAt: string;
	toProfileImagePath: string;
	otherProfileName: string;
	numberOfTrades: number;
}
