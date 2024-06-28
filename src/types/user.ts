import { User } from "@prisma/client";

export interface CustomUserType extends Omit<User | null, 'password'> {
    isVerify: number | null,
    amountOfContract: number | null,
    receivedByContract: number | null,
    amountOfRewardsReceived: number | null,
    structureTurnover: number | null,
    numberOfPartners: number | null,
    dateWithUs: number | null,
    balance: number | null,
    sessionLiveTime: number | null,
    rzmBalance: number | null,
    totalContracts: number | null,
    locale: string | null,
    firstName: string | null,
    middleName: string | null,
    lastName: string | null,
    avatar: string | null,
    level: string | null,
    link: string | null,
    inviterName: string | null,
    inviterEmail: string | null,
    inviterPhone: string | null,
    inviterAvatar: string | null,
    connectLink: string | null,
    rzmLevel: string | null,
    roles: Roles | null,
    oldBalance: string | null,
    hasPromo: boolean | null,
    isTelegramConnect: boolean | null,
    canRequestCard: boolean | null,
    hasHeir: boolean | null,
    showGlobalStat: boolean | null,
    facebook: string | null,
    instagram: string | null,
    twitter: string | null,
    telegram: string | null,
    onIncomeMail: boolean | null,
    onContractIncomeMail: boolean | null,
    onSuccessWithdrawMail: boolean | null,
    onStartBonusMail: boolean | null,
    onNewItemsInCalendarMail: boolean | null,
    onEventMail: boolean | null,
    onCourseMail: boolean | null,
    onWebinarsMail: boolean | null,
    onNewsMail: boolean | null,
    onIncomeTg: boolean | null,
    onContractIncomeTg: boolean | null,
    onSuccessWithdrawTg: boolean | null,
    onStartBonusTg: boolean | null,
    onNewItemsInCalendarTg: boolean | null,
    onEventTg: boolean | null,
    onCourseTg: boolean | null,
    onWebinarsTg: boolean | null,
    onNewsTg: boolean | null,
}

enum Roles {
    ROLE_SUPER_ADMIN = "ROLE_SUPER_ADMIN",
    ROLE_ADMIN = "ROLE_ADMIN",
    ROLE_USER = "ROLE_USER"
}

export interface SendSMSCodePayload {
    phoneNumber: number | null,
    code: number
}

export interface LoginPayload {
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

export interface RegistrationPayload {
    username: string,
    password: string ,
    country: string ,
    referral: string ,
    email: string,
    dateOfBirth: string,
    secret_code: number,
    phone_number: string
    lastName: string
    firstName: string
}
