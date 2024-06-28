import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma/prisma-client";
import { User } from "@prisma/client";

import { prepareUserData } from "../src/utils/prepareUserData";
import { RegistrationPayload } from "../src/types/user";
import { Nullable } from "../src/types/app";


export const userRepositories = {
    findUniqueUser: async (data: { email: Nullable<string>, id: Nullable<string> }) => {
        const where = data.email ? { email: data.email } : data.id ? { id: data.id } : undefined;

        if (!where) return false
        return prisma.user.findUnique({ where });
    },
    createUser: async (userData: RegistrationPayload, password: string) => {
        const hashedPassword = await bcrypt.hash(password, 3)

        const user =  await prisma.user.create({
            data: { ...userData, password: hashedPassword}
        })

        return prepareUserData(user)
    },
    loginUser: async (passwordFromRequest: string, user: User) => {
        const valid = await bcrypt.compare(passwordFromRequest, user.password)

        if (!valid) {
            return false
        }

        const SECRET_KEY = process.env.SECRET_KEY ?? ''

        return jwt.sign({
                id: user.id
            }, SECRET_KEY
        )
    },
    deleteUser: async (userId: string) => {
        const result =  await prisma.user.delete({ where: { id: userId } });

        return !!result
    }
}
