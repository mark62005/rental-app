/*** NAV ***/
export interface INavLink {
	href: string;
	label: string;
	className?: string;
}

/* LANDING SECTIONS */
export interface ISectionNavLink extends INavLink {
	imageSrc: string;
	title: string;
	description: string;
}

export interface IFeatureCardProps {
	featureLink: ISectionNavLink;
}
