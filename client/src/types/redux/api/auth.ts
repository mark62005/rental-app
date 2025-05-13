import { AuthUser } from "aws-amplify/auth";
import { ITenant } from "@/types/app/tenants";
import { Manager } from "@/types/prismaTypes";

export interface IUser {
	cognitoInfo: AuthUser;
	userInfo: ITenant | Manager;
	userRole: string;
}
