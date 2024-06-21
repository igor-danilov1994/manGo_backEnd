import { User } from "@prisma/client";
import bcrypt from "bcryptjs";

import { CustomRequest, CustomResponse, RequestWithBody } from "../types";
import { prisma } from "../../prisma/prisma-client";

interface SendSMSCodePayload {
    phoneNumber: string | number,
    code: string
}
interface RegistrationPayload {
    username: string,
    password: string,
    country: string,
    referral: string,
    firstname: string
    lastname: string
    email: string,
    dateOfBirth: string,
    secret: string,
    phone_number: string
}

export const UserController = {
    registration: async(req: RequestWithBody<RegistrationPayload>, res: CustomResponse<User | { error: string }>) => {
        const {
            email,
            lastname,
            firstname,
            country,
            referral,
            username,
            password,
            secret,
            phone_number,
        } = req.body

       if (!username || !secret || !lastname || !email || !firstname || !country || !password || !referral || !phone_number) {
           return res.status(400).json({ error: 'Invalid data!' })
       }
       try {
           const existingUser = await prisma.user.findUnique({ where: {email} })

           if (existingUser) {
               return res.status(400).json({ error: 'This email already existing!' })
           }

           const hashedPassword = await bcrypt.hash(password, 3)

           const user = await prisma.user.create({
               data: {
                   lastname,
                   firstname,
                   email,
                   password: hashedPassword,
                   referral,
                   country,
                   phone_number,
               }
           })

           res.status(200).json(user);
       } catch (e) {
           console.log(e, 'error with registration')
       }
    },
    login: async(req: CustomRequest, res: CustomResponse<any>) => {
        res.send('login');
    },
    getUserById: async(req: CustomRequest, res: CustomResponse<any>) => {
        res.send('getUserById');
    },
    getMyData: async(req: CustomRequest, res: CustomResponse<any>) => {
        res.send('getMyData');
    },
    updateUser: async(req: CustomRequest, res: CustomResponse<any>) => {
        res.send('updateUser');
    },
    sendSMSCode: async(req: RequestWithBody<SendSMSCodePayload>, res: CustomResponse<any>) => {
        const { phoneNumber, code } = req.body

        if (!phoneNumber || !code){
            return res.status(400).json({ error: 'Code is required' })
        }

        const secretCode = 'secretCode'

        res.send({ secretCode });
    },
}


