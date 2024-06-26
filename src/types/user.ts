import { User } from "@prisma/client";

export interface CustomUserType extends Omit<User, 'password'> {}


export interface SendSMSCodePayload {
    phoneNumber: number,
    code: number
}

export interface LoginPayload {
    phone_number: string,
    email: string,
    password: string
}

export interface RegistrationPayload {
    username: string,
    password: string,
    country: string,
    referral: string,
    firstname: string
    lastname: string
    email: string,
    dateOfBirth: string,
    secret_code: number,
    phone_number: string
}
