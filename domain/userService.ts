import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import nodemailer from "nodemailer";

import { prepareUserData } from "../src/utils/prepareUserData";
import { AccessData, RegistrationRequest } from "../src/types/user";
import { Nullable } from "../src/types/app";
import { generateCreateClientRandomCode } from "../src/utils/generateCreateClientRandomCode";
import { userRepositories } from "../repositories/user";

let temp_client_id = ''
let temp_client_secret_code = ''

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    tls: {
        rejectUnauthorized: false,
    },
    connectionTimeout: 60000,
    auth: {
        user: process.env.USER_FOR_SEND_MESSAGE,
        pass: process.env.PASS_FOR_SEND_MESSAGE
    }
});

export const userService = {
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

        return await userRepositories.findUniqueUser(where)
    },
    createUser: async (userData: RegistrationRequest, password: string) => {
        const hashedPassword = await bcrypt.hash(password, 3)

        const user = await userRepositories.createUser({...userData, password: hashedPassword})

        return prepareUserData(user)
    },
    sendSMSCode: async (email: string) => {
        const code = generateCreateClientRandomCode('numbers', 4)

        try {
            const mailOptions = {
                from: `ManGo Trade Platform <no-reply@manGo.io>`,
                to: email,
                subject: 'Secret code for manGo Trade Platform',
                text: `Secret code for manGo Trade Platform - ${code}`
            };

            const response = await transporter.sendMail(mailOptions)

            return { email: response.accepted[0], code }
        } catch (error) {
            console.error('Ошибка при отправке SMS:', error);
            return false
        }
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
        const result =  await userRepositories.deleteUser(userId);

        return !!result
    }
}
