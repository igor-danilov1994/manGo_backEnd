import { User } from "@prisma/client";
import { CustomUserType } from "../types/user";

export const prepareUserData = (userData: User): CustomUserType => {
    return {
        secret_code: userData.secret_code,
        username: userData.username,
        dateOfBirth: userData.dateOfBirth,
        id: userData.id,
        email: userData.email,
        firstname: userData.firstname,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
        lastname: userData.lastname,
        referral: userData.referral,
        country: userData.country,
        phone_number: userData.phone_number
    }
}
