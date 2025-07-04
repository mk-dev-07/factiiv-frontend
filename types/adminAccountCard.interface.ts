export interface IAdminAccountCard {
    name: string,
    email: string,
    joinedOn: string,
    numberOfBusinesses: number,
    linkTo?: string,
    suspended?: boolean,
    imagePath?: string,
}