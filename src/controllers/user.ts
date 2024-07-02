import { Request } from "express";

import {
    CustomResponse,
    RequestWithBody,
    RequestWithParams,
    RequestWithUser
} from "../types/app";
import { prepareUserData } from "../utils/prepareUserData";
import {
    AccessData,
    CustomUserType,
    LoginRequest,
    RegistrationRequest,
    CheckSMSCodePayload,
    SendSMSCodePayload,
    LoginResponse
} from "../types/user";
import { userService } from "../../domain/userService";

let _tempSecretCode = '';
let _tempUserEmail = ''

export const UserController = {
    test: async(_: Request, res: CustomResponse<{ status: 'test passed' }>) => {
        res.send({ status: 'test passed' })
    },
    createClient: async(_: Request, res: CustomResponse<AccessData>) => {
        try {
            const createClient = await userService.createClient()

            res.json(createClient)
        } catch (e){
            console.log(e, 'Error with createClient')
            res.status(400).json({ error: 'Error createClient' })
        }
    },
    registration: async(req: RequestWithBody<RegistrationRequest>, res: CustomResponse<{ success: boolean }>) => {
       if (!req.body.password || !req.body.email || !req.body.referral) {
           return res.status(400).json({ error: 'Invalid data!' })
       }

       try {
           const existingUser = await userService.findUniqueUser({email: req.body.email, id: null})

           if (existingUser) {
               return res.status(400).json({ error: 'This email already existing!' })
           }

           const user = await userService.createUser({
               ...req.body,
               email: _tempUserEmail,
           }, req.body.password)

           res.json({ success: !!user });
       } catch (e) {
           console.log(e, 'error with registration')
       }
    },
    login: async(req: RequestWithBody<LoginRequest>, res: CustomResponse<LoginResponse>) => {
       const { phone_number, password, email, client_secret, client_id } = req.body

        if (!phone_number || !password || !email){
            return res.status(400).json({ error: "phone_number or email and password is required" })
        }

        const accessClient = await userService.checkClientAccessData({client_secret, client_id})

        if (!accessClient){
            return res.status(400).json({ error: "Not access" })
        }

        try {
            const user = await userService.findUniqueUser({email: req.body.email, id: null})

            if (!user) {
                return res.status(400).json({  error: 'User not found' })
            }

            const token = await userService.loginUser(password, user)

            if (!token) {
                return res.status(400).json({  error: 'Wrong login or password' })
            }

            res.json({ access_token: token, id: user.id})
        } catch (e) {
            console.log(e, 'Error login')
            res.status(400).json({ error: 'Error login' })
        }
    },
    getUserById: async(req: RequestWithParams<{id: string}>, res: CustomResponse<CustomUserType>) => {
        try {
            const user = await userService.findUniqueUser({email: null, id: req.params.id})

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
            const user = await userService.findUniqueUser({email: null, id: req.user.id})

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
            const user = await userService.findUniqueUser({email: null, id: req.user.id})

            if (!user) {
                return res.status(400).json({ error: "User not found" })
            }

            res.send(prepareUserData(user))

        } catch (e) {
            console.log(e, 'error getMyData')
            res.status(400).json({ error: 'Error getMyData' })
        }
    },
    sendSMSCode: async(req: RequestWithBody<SendSMSCodePayload>, res: CustomResponse<unknown>) => {
        const { email } = req.body

        if (!email){
            return res.status(400).json({ error: 'PhoneNumber is required' })
        }

        const result = await userService.sendSMSCode(email)

       if (!result){
           return res.status(400).json({ error: `Error with send code on ${email} - email` })
       }

        _tempUserEmail = email
        _tempSecretCode = result.code

        res.json({ send: !!result });
    },
    checkSMSCode: async(req: RequestWithBody<CheckSMSCodePayload>, res: CustomResponse<{access: boolean}>) => {
        const { email, code } = req.body

        if (!email || !code){
            return res.status(400).json({ error: 'SecretCode and phone number is required' })
        }

        const isInvalidData = email !== _tempUserEmail || `${code}` !== _tempSecretCode

        if (isInvalidData) {
            return res.status(400).json({ error: 'invalid code or email number' });
        }

        res.json({ access: !isInvalidData })
    },
    deleteUser: async(req: RequestWithUser, res: CustomResponse<{ success: boolean }>) => {
        const userId = req.user.id

        if (!userId){
            return res.status(400).json({ error: 'This user not found!' })
        }

        try {
            const user = await userService.findUniqueUser({email: null, id: req.user.id})

            if (!user) {
                return  res.status(400).json({ error: "User not found" })
            }

            const isSuccess = await userService.deleteUser(user.id)

           res.json({ success: isSuccess })
        } catch (e){
            console.log(e, 'Error deleteUser')
            res.status(400).json({ error: 'Error deleteUser' });
        }
    },
}


