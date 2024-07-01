import express from "express";

import  { checkUserAuth } from "../middleware/checkUserAuth";
import { UserController } from "../controllers";
import {checkData, validateEmail} from "../middleware/validateData";


const router = express.Router();
const {
    registration,
    login,
    getUserById,
    getMyData,
    updateUser,
    sendSMSCode,
    deleteUser,
    test,
    checkSMSCode,
    createClient
} = UserController

//USER
router.post('/test', test)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
router.post('/login', validateEmail, checkData, login)
router.get('/create-client', createClient)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
router.post('/registration', validateEmail, checkData, registration)
router.post('/registration/send-sms-code', sendSMSCode)
router.post('/registration/check-sms-code', checkSMSCode)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
router.get('/getMyData', checkUserAuth, getMyData)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
router.get('/user/:id', checkUserAuth, getUserById)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
router.put('/user', checkUserAuth, updateUser)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
router.delete('/user/delete', checkUserAuth, deleteUser)
// router.put('/users/:id', checkUserAuth, uploads.single('avatar'), updateUser)

export default router;

