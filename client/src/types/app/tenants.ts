import { Tenant } from "@/types/prismaTypes";

export interface ITenant extends Tenant {
	id: number;
	cognitoId: string;
	name: string;
	email: string;
	phoneNumber?: string;
}
