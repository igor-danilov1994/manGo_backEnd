import express from "express";
import {userController} from "../controllers";
import {AuthMiddleware, ValidatorMiddleware} from "../middleware";

const router = express.Router();
const {
    registration,
    login,
    getUserById,
    getMyData,
    updateUser,
    sendSMSCode,
    deleteUser,
    checkSMSCode,
    createClient
} = userController

const authMiddleware = new AuthMiddleware();
const guardValidData = [ValidatorMiddleware.validateEmail, ValidatorMiddleware.checkData]

//USER
router.post('/login', guardValidData, login)
router.get('/create-client', createClient)
router.post('/registration', guardValidData, registration)
router.post('/registration/send-sms-code', guardValidData, sendSMSCode)
router.post('/registration/check-sms-code', checkSMSCode)
router.get('/getMyData', authMiddleware.checkUserAuth, getMyData)
router.get('/user/:id', authMiddleware.checkUserAuth, getUserById)
router.put('/user', authMiddleware.checkUserAuth, updateUser)
router.delete('/user/delete', authMiddleware.checkUserAuth, deleteUser)
// router.put('/users/:id', authMiddleware.checkUserAuth, uploads.single('avatar'), updateUser)

export default router;

