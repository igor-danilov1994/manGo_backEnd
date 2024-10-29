import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {User} from "@prisma/client";
import {AccessData, CustomUserType, RegistrationRequest} from "../types/user";
import {Nullable} from "../types/common";
import {UserRepository} from "../repositories/user";
import EmailService from "../services/emailService/emailService";
import {GenerateCreateClientRandomCode, prepareUserData} from "../utils";

interface IFindUniqueUserData {
    email: Nullable<string>,
    id: Nullable<string>
}
type IFindUniqueUserResponse = Promise<Nullable<User>>
type ISendSMSCodeResponse = Promise<{ email: string, code: string } | null>
type ILoginUserResponse = Promise<string | false>
type IDeleteUserResponse = Promise<boolean>
type ICheckClientAccessDataResponse = boolean
type ICreateUserResponse = Promise<CustomUserType>

interface ICreateClientResponse {
    client_id: string,
    client_secret: string
}

interface IUserService {
    createClient: () => ICreateClientResponse
    findUniqueUser: (data: IFindUniqueUserData) => IFindUniqueUserResponse
    createUser: (userData: RegistrationRequest, password: string) => ICreateUserResponse
    sendSMSCode: (email: string) => ISendSMSCodeResponse
    checkClientAccessData: (accessData: AccessData) => ICheckClientAccessDataResponse
    loginUser: (passwordFromRequest: string, user: User) => ILoginUserResponse
    deleteUser: (userId: string) => IDeleteUserResponse
}

const RandomCodeGenerator = new GenerateCreateClientRandomCode()

export class UserService implements IUserService {
    private temp_client_id = '';
    private temp_client_secret_code = '';
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    createClient(): ICreateClientResponse {
        const client_id = RandomCodeGenerator.generate('numbers', 10);
        const client_secret_code = RandomCodeGenerator.generate('letters', 10);

        this.temp_client_id = client_id;
        this.temp_client_secret_code = client_secret_code;

        return {
            client_id,
            client_secret: client_secret_code,
        };
    }

    async findUniqueUser(data: IFindUniqueUserData): IFindUniqueUserResponse {
        const where = data.email ? { email: data.email } : data.id ? { id: data.id } : undefined;

        if (!where) return null;

        return await this.userRepository.findUniqueUser(where);
    }

    async createUser(userData: RegistrationRequest, password: string): ICreateUserResponse {
        const hashedPassword = await bcrypt.hash(password, 3);
        const user = await this.userRepository.createUser({ ...userData, password: hashedPassword });

        return prepareUserData(user);
    }

    async sendSMSCode(email: string): ISendSMSCodeResponse {
        const code = RandomCodeGenerator.generate('numbers', 4);

        try {
            const mailOptions = {
                from: `ManGo Trade Platform <no-reply@manGo.io>`,
                to: email,
                subject: 'Secret code for manGo Trade Platform',
                text: `Secret code for manGo Trade Platform - ${code}`
            };

            const response = await EmailService.sendMail(mailOptions);

            return { email: response.accepted[0], code };
        } catch (error) {
            console.error('Ошибка при отправке SMS:', error);
            return null;
        }
    }

    checkClientAccessData(accessData: AccessData): ICheckClientAccessDataResponse {
        return accessData.client_id === this.temp_client_id || accessData.client_secret === this.temp_client_secret_code;
    }

    async loginUser(passwordFromRequest: string, user: User): ILoginUserResponse {
        const valid = await bcrypt.compare(passwordFromRequest, user.password);

        if (!valid) {
            return false;
        }

        const SECRET_KEY = process.env.SECRET_KEY ?? '';

        return jwt.sign({ id: user.id }, SECRET_KEY);
    }

    async deleteUser(userId: string): IDeleteUserResponse {
        const result = await this.userRepository.deleteUser(userId);

        return !!result;
    }
}
