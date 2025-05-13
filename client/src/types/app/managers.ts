import { Manager } from "@/types/prismaTypes";

export interface IManager extends Manager {
	id: number;
	cognitoId: string;
	name: string;
	email: string;
	phoneNumber?: string;
}
