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
import { generateCreateClientRandomCode } from "../utils/generateCreateClientRandomCode";

const smsSecretCode = 1234
let userTempPhoneNumber = 0
let temp_client_id = ''
let temp_client_secret_code = ''

export const UserController = {
    test: async(_: Request, res: CustomResponse<{ status: 'test passed' }>) => {
        res.send({ status: 'test passed' })
    },
    createClient: async(_: Request, res: CustomResponse<{ client_id: string, client_secret: string }>) => {
        const client_id = generateCreateClientRandomCode('numbers', 10)
        const client_secret_code = generateCreateClientRandomCode('letters',10)

        temp_client_id = client_id
        temp_client_secret_code = client_secret_code

        res.send({
            client_id,
            client_secret: client_secret_code,
        })
    },
    registration: async(req: RequestWithBody<RegistrationPayload>, res: CustomResponse<CustomUserType>) => {
       if (!req.body.username ||
           !req.body.password ||
           !req.body.secret_code ||
           !req.body.lastName ||
           !req.body.email ||
           !req.body.firstName ||
           !req.body.country ||
           !req.body.referral ||
           !req.body.phone_number
       ) {
           return res.status(400).json({ error: 'Invalid data!' })
       }

       try {
           const existingUser = await userRepositories.findUniqueUser({email: req.body.email, id: null})

           if (existingUser) {
               return res.status(400).json({ error: 'This email already existing!' })
           }

           const user = await userRepositories.createUser(req.body, req.body.password)

           res.status(200).json(user);
       } catch (e) {
           console.log(e, 'error with registration')
       }
    },
    login: async(req: RequestWithBody<LoginPayload>, res: CustomResponse<{ access_token: string }>) => {
       const { phone_number, password, email, client_secret, client_id } = req.body

        if (!phone_number || !password || !email){
            return res.status(400).json({ error: "phone_number or email and password is required" })
        }

        if (client_secret !== temp_client_secret_code ||  client_id !== temp_client_id){
            return res.status(400).json({ error: "Not access" })
        }

        try {
            const user = await userRepositories.findUniqueUser({email: req.body.email, id: null})

            if (!user) {
                return res.status(400).json({  error: 'User not found' })
            }

            const token = await userRepositories.loginUser(password, user)

            if (!token) {
                return res.status(400).json({  error: 'Wrong login or password' })
            }

            res.json({ access_token: token})
        } catch (e) {
            console.log(e, 'Error login')
            res.status(400).json({ error: 'Error login' })
        }
    },
    getUserById: async(req: RequestWithParams<{id: string}>, res: CustomResponse<CustomUserType>) => {
        try {
            const user = await userRepositories.findUniqueUser({email: null, id: req.params.id})

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
            const user = await userRepositories.findUniqueUser({email: null, id: req.user.id})

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
            const user = await userRepositories.findUniqueUser({email: null, id: req.user.id})

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
            const user = await userRepositories.findUniqueUser({email: null, id: req.user.id})

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


