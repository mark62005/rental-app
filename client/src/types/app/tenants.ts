import { Tenant } from "@/types/prismaTypes";
import { IProperty } from "./properties";

export interface ITenant extends Tenant {
	id: number;
	cognitoId: string;
	name: string;
	email: string;
	phoneNumber?: string;
	favorites: IProperty[];
}
