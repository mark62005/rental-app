import { LucideIcon } from "lucide-react";
import { INavLink } from "./component-props";

export interface ISidebarNavLink extends INavLink {
	Icon: LucideIcon;
}

export interface ISidebarNavLinksConfig {
	managers: ISidebarNavLink[];
	tenants: ISidebarNavLink[];
}
