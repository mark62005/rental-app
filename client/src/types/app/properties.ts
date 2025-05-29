import { Property } from "../prismaTypes";
import { ILocation } from "./locations";
import { AmenityEnum, HighlightEnum, PropertyTypeEnum } from "@/lib/constants";

export interface IProperty extends Property {
	id: number;
	name: string;
	description: string;
	pricePerMonth: number;
	securityDeposit: number;
	applicationFee: number;
	photoUrls: string[];
	amenities: AmenityEnum[];
	highlights: HighlightEnum[];
	isPetsAllowed: boolean;
	isParkingIncluded: boolean;
	beds: number;
	baths: number;
	squareFeet: number;
	propertyType: PropertyTypeEnum;
	postedDate: Date;
	averageRating?: number;
	numberOfReviews?: number;
	locationId: number;
	managerCognitoId: number;

	location: ILocation;
}
