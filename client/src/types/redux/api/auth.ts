import { AuthUser } from "aws-amplify/auth";
import { ITenant } from "@/types/app/tenants";
import { IManager } from "@/types/app/managers";

export interface IUser {
	cognitoInfo: AuthUser;
	userInfo: ITenant | IManager;
	userRole: string;
}
