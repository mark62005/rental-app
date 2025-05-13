"use client";

import { LayoutProps } from "@/types/app/page-props";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { SidebarProvider } from "@/components/ui/sidebar";
import Navbar from "@/components/shared/Navbar";
import AppSidebar from "@/components/shared/AppSidebar";
import { useGetAuthUserQuery } from "@/state/apis/authApi";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function DashboardLayout({ children }: LayoutProps) {
	const router = useRouter();
	const pathname = usePathname();

	const {
		data: authUser,
		isError,
		isLoading: isAuthLoading,
	} = useGetAuthUserQuery();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (authUser) {
			const userRole = authUser.userRole?.toLowerCase() as "manager" | "tenant";
			if (
				(userRole === "manager" && pathname.startsWith("/tenants")) ||
				(userRole === "tenant" && pathname.startsWith("/managers"))
			) {
				router.push(
					userRole === "manager"
						? "/managers/properties"
						: "/tenants/favorites",
					{ scroll: false }
				);
			} else {
				setIsLoading(false);
			}
		}
	}, [authUser, pathname, router]);

	if (isAuthLoading || isLoading) return <>Loading...</>;
	if (isError) return <>Error fetching user.</>;
	if (!authUser?.userRole) return null;

	return (
		<SidebarProvider>
			<div className="min-h-screen w-full bg-gray-100">
				<Navbar />

				<main
					className="flex"
					style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}
				>
					<AppSidebar
						userRole={authUser.userRole.toLowerCase() as "manager" | "tenant"}
					/>
					<div className="grow transition-all duration-300">{children}</div>
				</main>
			</div>
		</SidebarProvider>
	);
}
export default DashboardLayout;
