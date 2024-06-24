import { User } from "@prisma/client";
import bcrypt from "bcryptjs";

import {
    CustomRequest,
    CustomResponse,
    RequestWithBody,
    RequestWithQuery,
    RequestWithUser
} from "../types";
import { prisma } from "../../prisma/prisma-client";
import jwt from "jsonwebtoken";

interface SendSMSCodePayload {
    phoneNumber: string | number,
    code: string
}

interface LoginPayload {
    phone_number: string,
    email: string,
    password: string
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
    test: async(req: RequestWithBody<RegistrationPayload>, res: CustomResponse<User | { status: string }>) => {
        res.send({ status: 'test passed' })
    },
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
    login: async(req: RequestWithBody<LoginPayload>, res: CustomResponse<any>) => {
       const { phone_number, password, email } = req.body

        if (!phone_number || !password || !email){
            return res.status(400).json({ error: "phone_number or email and password is required" })
        }

        try {
            const user = await prisma.user.findUnique({ where: { email } })

            if (!user) {
                return res.status(400).json({  error: 'User not found' })
            }

            const valid = await bcrypt.compare(password, user.password)

            if (!valid) {
                return res.status(400).json({  error: 'Wrong login or password' })
            }
            const SECRET_KEY = process.env.SECRET_KEY ?? ''

            const token = jwt.sign({
                    id: user.id
                }, SECRET_KEY
            )

            res.json({token})
        } catch (e) {
            console.log(e, 'Error login')
            res.status(400).json({ error: 'Error login' })
        }
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
    deleteUser: async(req: RequestWithUser & RequestWithQuery<{ id: string }>, res: CustomResponse<any>) => {
        const userId = req.user.id
        const userIdFromQuery = req.query.id

        if (!userId){
            return res.status(400).json({ error: 'This user not found!' })
        }

        try {
            const user = await prisma.user.findUnique({ where: { id: userIdFromQuery ?? userId }})

            if (!user) {
                return  res.status(400).json({ error: "User not found" })
            }

           const result =  await prisma.user.delete({ where: { id: userId } });

           res.json({ success: !!result })
        } catch (e){
            console.log(e, 'Error deleteUser')
            res.status(400).json({ error: 'Error deleteUser' });
        }
    },
}


