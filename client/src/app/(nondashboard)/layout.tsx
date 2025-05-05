"use client ";

import { NAVBAR_HEIGHT } from "@/lib/constants";
import { LayoutProps } from "@/types/app/page-props";

function NonDashboardLayout({ children }: LayoutProps) {
	return (
		<div>
			{/* TODO: Navbar */}
			Navbar
			<main
				className={`h-full flex w-full flex-col`}
				style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}
			>
				{children}
			</main>
		</div>
	);
}
export default NonDashboardLayout;
