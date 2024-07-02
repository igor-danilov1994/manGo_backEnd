import { prisma } from "../prisma/prisma-client";
import { Prisma } from "@prisma/client";
import { RegistrationRequest } from "../src/types/user";

export const userRepositories = {
    findUniqueUser: async (where: Prisma.UserWhereUniqueInput) => {
        return prisma.user.findUnique({where});
    },
    createUser: async (userData: RegistrationRequest) => {
        return prisma.user.create({
            data: userData
        })
    },
    deleteUser: async (userId: string) => {
        return prisma.user.delete({ where: { id: userId } });
    }
}

