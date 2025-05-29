import { TSettingsFormData } from "@/lib/schemas";
import { IProperty } from "./properties";

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

/*** DASHBOARD PAGES ***/
export interface AppSidebarProps {
	userRole: "manager" | "tenant";
}

export interface SidebarToggleButtonProps {
	variant: "open" | "close";
}

/*** SETTINGS PAGES ***/
export interface SettingsFormProps {
	initialData: TSettingsFormData;
	onSubmit: (data: TSettingsFormData) => Promise<void>;
	userRole: "manager" | "tenant";
	isLoading: boolean;
}

/*** SEARCH PAGE ***/
export interface CardProps {
	property: IProperty;
	isFavorite: boolean;
	onFavoriteToggle: () => void;
	showFavoriteButton?: boolean;
	propertyLink?: string;
}

export interface CardCompactProps {
	property: IProperty;
	isFavorite: boolean;
	onFavoriteToggle: () => void;
	showFavoriteButton?: boolean;
	propertyLink?: string;
}
