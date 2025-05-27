import {
	IDiscoverCardProps,
	INavLink,
	ISectionNavLink,
} from "@/types/app/component-props";
import { ISidebarNavLinksConfig } from "@/types/app/config";
import {
	Building,
	Car,
	Castle,
	Dumbbell,
	FileText,
	Heart,
	Home,
	LucideIcon,
	Maximize,
	PawPrint,
	Settings,
	Thermometer,
	Trees,
	Tv,
	Warehouse,
	Waves,
	Wifi,
} from "lucide-react";

/* NAVBAR */
export const NAVBAR_HEIGHT = 56; // in pixels
export const MAIN_HEIGHT = `calc(100vh - ${NAVBAR_HEIGHT}px)`;

/* SIDEBAR */
export const SIDEBAR_NAVLINKS_CONFIG: ISidebarNavLinksConfig = {
	managers: [
		{ Icon: Building, label: "Properties", href: "/managers/properties" },
		{
			Icon: FileText,
			label: "Applications",
			href: "/managers/applications",
		},
		{ Icon: Settings, label: "Settings", href: "/managers/settings" },
	],
	tenants: [
		{ Icon: Heart, label: "Favorites", href: "/tenants/favorites" },
		{
			Icon: FileText,
			label: "Applications",
			href: "/tenants/applications",
		},
		{ Icon: Home, label: "Residences", href: "/tenants/residences" },
		{ Icon: Settings, label: "Settings", href: "/tenants/settings" },
	],
} as const;

/*** LANDING PAGE CONFIGS ***/

/* FEATURES SECTION CONFIG */
export const FEATURES_CONFIG: ISectionNavLink[] = [
	{
		title: "Trustworthy and Verified Listings",
		description:
			"Discover the best rental options with user reviews and ratings.",
		label: "Explore",
		href: "/explore",
		imageSrc: "/landing-search3.png",
	},
	{
		title: "Browse Rental Listings with Ease",
		description:
			"Get access to user reviews and ratings for a better understanding of rental options.",
		label: "Search",
		href: "/search",
		imageSrc: "/landing-search2.png",
	},
	{
		title: "Simplify Your Rental Search with Advanced",
		description:
			"Find trustworthy and verified rental listings to ensure a hassle-free experience.",
		label: "Discover",
		href: "/discover",
		imageSrc: "/landing-search1.png",
	},
] as const;

/* DISCOVER SECTION CONFIG */
export const DISCOVER_CONFIG: IDiscoverCardProps[] = [
	{
		imageSrc: "/landing-icon-wand.png",
		title: "Search for Properties",
		description:
			"Browse through our extensive collection of rental properties in your desired location.",
	},
	{
		imageSrc: "/landing-icon-calendar.png",
		title: "Book Your Rental",
		description:
			"Once you've found the perfect rental property, easily book it online with just a few clicks.",
	},
	{
		imageSrc: "/landing-icon-heart.png",
		title: "Enjoy your New Home",
		description:
			"Move into your new rental property and start enjoying your dream home.",
	},
] as const;

/* FOOTER CONFIGS */
export const FOOTER_NAV_CONFIG: INavLink[] = [
	{
		label: "About Us",
		href: "/about",
	},
	{
		label: "Contact Us",
		href: "/contact",
	},
	{
		label: "FAQ",
		href: "/frequently-asked-questions",
	},
	{
		label: "Terms",
		href: "/terms",
	},
	{
		label: "Privacy",
		href: "/privacy",
	},
] as const;

/* ENUMS */
export enum PropertyTypeEnum {
	Rooms = "Rooms",
	Tinyhouse = "Tinyhouse",
	Apartment = "Apartment",
	Villa = "Villa",
	Townhouse = "Townhouse",
	Cottage = "Cottage",
}

export const PropertyTypeIcons: Record<PropertyTypeEnum, LucideIcon> = {
	Rooms: Home,
	Tinyhouse: Warehouse,
	Apartment: Building,
	Villa: Castle,
	Townhouse: Home,
	Cottage: Trees,
};

export enum AmenityEnum {
	WasherDryer = "WasherDryer",
	AirConditioning = "AirConditioning",
	Dishwasher = "Dishwasher",
	HighSpeedInternet = "HighSpeedInternet",
	HardwoodFloors = "HardwoodFloors",
	WalkInClosets = "WalkInClosets",
	Microwave = "Microwave",
	Refrigerator = "Refrigerator",
	Pool = "Pool",
	Gym = "Gym",
	Parking = "Parking",
	PetsAllowed = "PetsAllowed",
	WiFi = "WiFi",
}

export const AmenityIcons: Record<AmenityEnum, LucideIcon> = {
	WasherDryer: Waves,
	AirConditioning: Thermometer,
	Dishwasher: Waves,
	HighSpeedInternet: Wifi,
	HardwoodFloors: Home,
	WalkInClosets: Maximize,
	Microwave: Tv,
	Refrigerator: Thermometer,
	Pool: Waves,
	Gym: Dumbbell,
	Parking: Car,
	PetsAllowed: PawPrint,
	WiFi: Wifi,
};
