import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma/prisma-client";
import { User } from "@prisma/client";

import { prepareUserData } from "../src/utils/prepareUserData";
import {AccessData, RegistrationPayload} from "../src/types/user";
import { Nullable } from "../src/types/app";
import {generateCreateClientRandomCode} from "../src/utils/generateCreateClientRandomCode";

let temp_client_id = ''
let temp_client_secret_code = ''

export const userRepositories = {
    createClient: async () => {
        const client_id = await generateCreateClientRandomCode('numbers', 10)
        const client_secret_code = await generateCreateClientRandomCode('letters',10)

        temp_client_id = client_id
        temp_client_secret_code = client_secret_code

        return {
            client_id,
            client_secret: client_secret_code,
        }
    },
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
    checkClientAccessData: async (accessData: AccessData): Promise<boolean> => {
        return accessData.client_id === temp_client_id || accessData.client_secret === temp_client_secret_code
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
