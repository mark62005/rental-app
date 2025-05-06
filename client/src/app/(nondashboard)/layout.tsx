"use client ";

import Navbar from "@/components/shared/Navbar";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { LayoutProps } from "@/types/app/page-props";

function NonDashboardLayout({ children }: LayoutProps) {
	return (
		<div>
			<Navbar />

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
