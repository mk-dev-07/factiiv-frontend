import Profile from "./profile.interface";

export interface IUser {
	id: string;
	firstName: string;
	lastName: string;
	username: string;
	email: string;
	profiles: Profile[];
	createdAt: string;
	updatedAt: string;
	deletedAt: null;
	deleted: boolean;
	suspended: boolean;
	suspendedAt: null;
	userActivated: boolean;
	imagePath?: string;
}
