import { Location } from "../prismaTypes";

export interface ILocation extends Location {
	id: number;
	address: string;
	city: string;
	state: string;
	country: string;
	postalCode: string;
	coordinates: {
		latitude: number;
		longitude: number;
	};
}
