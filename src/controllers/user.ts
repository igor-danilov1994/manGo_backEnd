import { Request } from "express";

import {
    CustomResponse,
    RequestWithBody,
    RequestWithParams,
    RequestWithUser
} from "../types/app";
import { prepareUserData } from "../utils/prepareUserData";
import {
    CustomUserType,
    LoginPayload,
    RegistrationPayload,
    SendSMSCodePayload
} from "../types/user";
import { userRepositories } from "../../repositories/user";

const smsSecretCode = 1234

let userTempPhoneNumber = 0

export const UserController = {
    test: async(_: Request, res: CustomResponse<{ status: 'test passed' }>) => {
        res.send({ status: 'test passed' })
    },
    registration: async(req: RequestWithBody<RegistrationPayload>, res: CustomResponse<CustomUserType>) => {
       if (!req.body.username ||
           !req.body.secret_code ||
           !req.body.lastname ||
           !req.body.email ||
           !req.body.firstname ||
           !req.body.country ||
           !req.body.password ||
           !req.body.referral ||
           !req.body.phone_number
       ) {
           return res.status(400).json({ error: 'Invalid data!' })
       }

       try {
           const existingUser = await userRepositories.findUniqueUser(req.body)

           if (existingUser) {
               return res.status(400).json({ error: 'This email already existing!' })
           }

           const user = await userRepositories.createUser(req.body, req.body.password)

           res.status(200).json(user);
       } catch (e) {
           console.log(e, 'error with registration')
       }
    },
    login: async(req: RequestWithBody<LoginPayload>, res: CustomResponse<{ token: string }>) => {
       const { phone_number, password, email } = req.body

        if (!phone_number || !password || !email){
            return res.status(400).json({ error: "phone_number or email and password is required" })
        }

        try {
            const user = await userRepositories.findUniqueUser(req.body)

            if (!user) {
                return res.status(400).json({  error: 'User not found' })
            }

            const token = await userRepositories.loginUser(password, user)

            if (!token) {
                return res.status(400).json({  error: 'Wrong login or password' })
            }

            res.json({token})
        } catch (e) {
            console.log(e, 'Error login')
            res.status(400).json({ error: 'Error login' })
        }
    },
    getUserById: async(req: RequestWithParams<{id: string}>, res: CustomResponse<CustomUserType>) => {
        try {
            const user = await userRepositories.findUniqueUser(req.params)

            if (!user) {
                return res.status(400).json({ error: "User not found" })
            }

            res.send(prepareUserData(user))

        } catch (e) {
            console.log(e, 'error getMyData')
            res.status(400).json({ error: 'Error getMyData' })
        }
    },
    getMyData: async(req: RequestWithUser, res: CustomResponse<CustomUserType>) => {
        try {
            const user = await userRepositories.findUniqueUser(req.user)

            if (!user) {
                return res.status(400).json({ error: "User not found" })
            }

            res.send(prepareUserData(user))

        } catch (e) {
            console.log(e, 'error getMyData')
            res.status(400).json({ error: 'Error getMyData' })
        }
    },
    updateUser: async(req: RequestWithUser, res: CustomResponse<CustomUserType>) => {
        try {
            const user = await userRepositories.findUniqueUser(req.user)

            if (!user) {
                return res.status(400).json({ error: "User not found" })
            }

            res.send(prepareUserData(user))

        } catch (e) {
            console.log(e, 'error getMyData')
            res.status(400).json({ error: 'Error getMyData' })
        }
    },
    sendSMSCode: async(req: RequestWithBody<{phoneNumber: SendSMSCodePayload['phoneNumber']}>, res: CustomResponse<{secretCode: 1234}>) => {
        const { phoneNumber } = req.body
        //Integrate some sms send service

        if (!phoneNumber){
            return res.status(400).json({ error: 'PhoneNumber is required' })
        }

        userTempPhoneNumber = phoneNumber

        res.send({ secretCode: smsSecretCode });
    },
    checkSMSCode: async(req: RequestWithBody<SendSMSCodePayload>, res: CustomResponse<{access: boolean}>) => {
        const { phoneNumber, code } = req.body

        if (!phoneNumber || !code){
            return res.status(400).json({ error: 'SecretCode and phone number is required' })
        }

        const isValidData = phoneNumber === userTempPhoneNumber && code === smsSecretCode

        if (!isValidData) {
            return res.status(400).json({ error: 'invalid code or phone number' });
        }

        res.json({ access: isValidData })
    },
    deleteUser: async(req: RequestWithUser, res: CustomResponse<{ success: boolean }>) => {
        const userId = req.user.id

        if (!userId){
            return res.status(400).json({ error: 'This user not found!' })
        }

        try {
            const user = await userRepositories.findUniqueUser(req.user)

            if (!user) {
                return  res.status(400).json({ error: "User not found" })
            }

            const isSuccess = await userRepositories.deleteUser(user.id)

           res.json({ success: isSuccess })
        } catch (e){
            console.log(e, 'Error deleteUser')
            res.status(400).json({ error: 'Error deleteUser' });
        }
    },
}


