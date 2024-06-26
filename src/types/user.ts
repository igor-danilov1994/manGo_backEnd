import { User } from "@prisma/client";

export interface CustomUserType extends Omit<User, 'password'> {}
