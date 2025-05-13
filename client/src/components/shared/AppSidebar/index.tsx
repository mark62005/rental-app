"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppSidebarProps } from "@/types/app/component-props";
import { ISidebarNavLink } from "@/types/app/config";
import {
	MAIN_HEIGHT,
	NAVBAR_HEIGHT,
	SIDEBAR_NAVLINKS_CONFIG,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import SidebarToggleButton from "./SidebarToggleButton";

function AppSidebar({ userRole }: AppSidebarProps) {
	const pathname = usePathname();
	const { open } = useSidebar();

	const navLinks =
		userRole === "manager"
			? SIDEBAR_NAVLINKS_CONFIG.managers
			: SIDEBAR_NAVLINKS_CONFIG.tenants;

	return (
		<Sidebar
			collapsible="icon"
			className="fixed left-0 bg-white shadow-lg"
			style={{
				top: `${NAVBAR_HEIGHT}px`,
				height: MAIN_HEIGHT,
			}}
		>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<div
							className={cn(
								"flex min-h-[56px] w-full items-center pt-3 mb-3",
								open ? "justify-between px-6" : "justify-center"
							)}
						>
							{open ? (
								<>
									<h1 className="text-xl font-bold text-gray-800">
										{userRole === "manager" ? "Manager" : "Renter"} View
									</h1>
									<SidebarToggleButton variant="close" />
								</>
							) : (
								<SidebarToggleButton variant="open" />
							)}
						</div>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				<SidebarMenu>
					{navLinks.map((link: ISidebarNavLink) => {
						const isActive = pathname === link.href;

						return (
							<SidebarMenuItem key={link.href}>
								<SidebarMenuButton
									asChild
									className={cn(
										"flex items-center p-7",
										isActive
											? "bg-gray-100"
											: "text-gray-600 hover:bg-gray-100",
										open ? "text-primary" : "ml-[5px]"
									)}
								>
									<Link
										href={link.href}
										className="w-full"
										scroll={false}
									>
										<div className="flex items-center gap-3">
											<link.Icon
												className={`size-5 ${
													isActive ? "text-primary" : "text-gray-600"
												}`}
											/>
											<span
												className={`font-medium ${
													isActive ? "text-blue-600" : "text-gray-600"
												}`}
											>
												{link.label}
											</span>
										</div>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						);
					})}
				</SidebarMenu>
			</SidebarContent>
		</Sidebar>
	);
}
export default AppSidebar;
