import { User } from "@prisma/client";
import { CustomUserType } from "../types/user";


export const prepareUserData = (userData: User) => {
    return {
        amountOfContract:  null,
        amountOfRewardsReceived:  null,
        avatar:  null,
        balance:  null,
        canRequestCard:  null,
        connectLink:  null,
        dateWithUs:  null,
        facebook:  null,
        hasHeir:  null,
        hasPromo:  null,
        instagram:  null,
        inviterAvatar:  null,
        inviterEmail:  null,
        inviterName:  null,
        inviterPhone:  null,
        isTelegramConnect:  null,
        isVerify:  null,
        level:  null,
        link:  null,
        locale:  null,
        middleName:  null,
        numberOfPartners:  null,
        oldBalance:  null,
        onContractIncomeMail:  null,
        onContractIncomeTg:  null,
        onCourseMail:  null,
        onCourseTg:  null,
        onEventMail:  null,
        onEventTg:  null,
        onIncomeMail:  null,
        onIncomeTg:  null,
        onNewItemsInCalendarMail:  null,
        onNewItemsInCalendarTg:  null,
        onNewsMail:  null,
        onNewsTg:  null,
        onStartBonusMail:  null,
        onStartBonusTg:  null,
        onSuccessWithdrawMail:  null,
        onSuccessWithdrawTg:  null,
        onWebinarsMail:  null,
        onWebinarsTg:  null,
        receivedByContract:  null,
        roles:  null,
        rzmBalance:  null,
        rzmLevel:  null,
        sessionLiveTime:  null,
        showGlobalStat:  null,
        structureTurnover:  null,
        telegram:  null,
        totalContracts:  null,
        twitter:  null,
        secret_code: userData.secret_code,
        username: userData.username,
        dateOfBirth: userData.dateOfBirth,
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
        lastName: userData.lastName,
        referral: userData.referral,
        country: userData.country,
        phone_number: userData.phone_number
    } as CustomUserType
}
