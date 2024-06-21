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
    deleteUser
} = UserController

//USER
router.post('/login', login)
router.post('/registration', registration)
router.post('/send-sms-code', sendSMSCode)
router.get('/current', checkUserAuth, getMyData)
router.get('/user/:id', checkUserAuth, getUserById)
router.put('/user/:id', checkUserAuth, updateUser)
router.delete('/user/delete', checkUserAuth, deleteUser)
// router.put('/users/:id', checkUserAuth, uploads.single('avatar'), updateUser)

export default router;

