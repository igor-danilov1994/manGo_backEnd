import { User } from "@prisma/client";

export interface CustomUserType extends Omit<User, 'password'> {}

// enum Roles {
//     ROLE_SUPER_ADMIN = "ROLE_SUPER_ADMIN",
//     ROLE_ADMIN = "ROLE_ADMIN",
//     ROLE_USER = "ROLE_USER"
// }

export interface SendSMSCodePayload {
    email: string | null,
}

export interface CheckSMSCodePayload extends SendSMSCodePayload {
    code: number
}

export interface LoginResponse {
    access_token: string,
    id: string
}

export interface LoginRequest {
    phone_number: string | null,
    email: string | null,
    password: string | null
    client_id?: string
    client_secret?: string
}

export interface AccessData {
    client_id?: string,
    client_secret?: string,
}

export interface RegistrationRequest {
    username: string,
    password: string ,
    country: string ,
    referral: number ,
    email: string,
    dateOfBirth: string,
    phone_number: string
    lastName: string
    firstName: string
    secret_code: number
}
