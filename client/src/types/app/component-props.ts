/*** NAV ***/
export interface INavLink {
	href: string;
	label: string;
	className?: string;
}

export interface NotificationBadgeProps {
	variant?: "notification" | "message";
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

export interface IDiscoverCardProps {
	imageSrc: string;
	title: string;
	description: string;
}
