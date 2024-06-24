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
    test
} = UserController

//USER
router.post('/test', test)
router.post('/login', login)
router.post('/registration', registration)
router.post('/send-sms-code', sendSMSCode)
// @ts-ignore
router.get('/current', checkUserAuth, getMyData)
// @ts-ignore
router.get('/user/:id', checkUserAuth, getUserById)
// @ts-ignore
router.put('/user/:id', checkUserAuth, updateUser)
// @ts-ignore
router.delete('/user/delete', checkUserAuth, deleteUser)
// router.put('/users/:id', checkUserAuth, uploads.single('avatar'), updateUser)

export default router;

