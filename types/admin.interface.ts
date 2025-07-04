export interface IAdmin {
	id: string;
	firstName: string;
	lastName: string;
	username: string;
	email: string;
	createdAt: string;
	updatedAt: string;
	deletedAt: null;
	deleted: boolean;
	adminActivated: boolean;
	isPrimary: boolean;
	reportRequests: any[];
	profiles: any[];
	profilesInfo: any[];
	lastLoginDate: string;
	itemsReviewed: number;
	trades: any[];
	activities: any[];
	imagePath: string;
}

export interface IAdminResponse {
	payload: IAdminPayload;
}

export interface IAdminPayload {
	content: IAdmin[];
	pageable: any;
	last: boolean;
	totalPages: number;
	totalElements: number;
	size: number;
	number: number;
	sort: any;
	first: boolean;
	numberOfElements: number;
	empty: boolean;
}
