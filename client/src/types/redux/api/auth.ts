import { AuthUser } from "aws-amplify/auth";
import { Manager, Tenant } from "@/types/prismaTypes";

export interface IUser {
	cognitoInfo: AuthUser;
	userInfo: Tenant | Manager;
	userRole: string;
}
