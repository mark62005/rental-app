import { ISectionNavLink } from "@/types/app/component-props";

/* NAVBAR */
export const NAVBAR_HEIGHT = 52; // in pixels
export const MAIN_HEIGHT = `calc(100vh - ${NAVBAR_HEIGHT}px)`;

/*** LANDING PAGE CONFIGS ***/

/* FEATURES SECTION CONFIG*/
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
