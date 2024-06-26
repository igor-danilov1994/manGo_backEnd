import express from "express";

import  { checkUserAuth } from "../middleware/checkUserAuth";
import { UserController } from "../controllers";


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
    checkSMSCode
} = UserController

//USER
router.post('/test', test)
router.post('/login', login)
router.post('/registration', registration)
router.post('/send-sms-code', sendSMSCode)
router.post('/check-sms-code', checkSMSCode)
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

