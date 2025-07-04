export interface NotificationResponse extends Response {
	payload: Payload;
}

interface Payload {
	content: Notification[];
	pageable: Pageable;
	totalPages: number;
	totalElements: number;
	last: boolean;
	size: number;
	number: number;
	sort: Sort;
	numberOfElements: number;
	first: boolean;
	empty: boolean;
}

export interface Notification {
	id: string;
	businessName: string;
	imagePath: string;
	date: string;
	tradeId: string;
	activityId: string;
	type: string;
	toProfileId: string;
	createdAt: string;
	message: string;
}

interface Pageable {
	sort: Sort;
	offset: number;
	pageNumber: number;
	pageSize: number;
	paged: boolean;
	unpaged: boolean;
}

interface Sort {
	empty: boolean;
	sorted: boolean;
	unsorted: boolean;
}

export enum NotificationType {
	TRADE = "TRADE",
	ACTIVITY = "ACTIVITY",
	REVIEW_DATA = "REVIEW_DATA",
	REVIEW_DOC = "REVIEW_DOC",
	REVIEW_INFO = "REVIEW_INFO",
	REVIEW = "REVIEW"
}
