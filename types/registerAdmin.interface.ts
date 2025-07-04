export interface IRegisterAdmin {
    firstName: string,
    lastName: string,
    email: string,
    username: string,
    tempPassword: string,
    jwt: string | null,
  }