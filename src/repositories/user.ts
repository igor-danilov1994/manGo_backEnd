import { prisma } from "../prisma/prisma-client";
import {Prisma, User} from "@prisma/client";
import { RegistrationRequest } from "../types/user";
import {Nullable} from "../types/common";

export class UserRepository {
    async findUniqueUser(where: Prisma.UserWhereUniqueInput): Promise<Nullable<User>> {
        return prisma.user.findUnique({ where });
    }

    async createUser(userData: RegistrationRequest): Promise<User> {
        return prisma.user.create({
            data: userData
        });
    }

    async deleteUser(userId: string): Promise<User> {
        return prisma.user.delete({ where: { id: userId } });
    }
}

