"use client";

import { SidebarToggleButtonProps } from "@/types/app/component-props";
import { useSidebar } from "@/components/ui/sidebar";
import { Menu, X } from "lucide-react";

function SidebarToggleButton({ variant }: SidebarToggleButtonProps) {
	const { toggleSidebar } = useSidebar();
	const iconClassName = "size-6 text-gray-600";

	return (
		<button
			className="hover:bg-gray-100 p-2 rounded-md cursor-pointer"
			onClick={() => toggleSidebar()}
		>
			{variant === "open" ? (
				<Menu className={iconClassName} />
			) : (
				<X className={iconClassName} />
			)}
		</button>
	);
}
export default SidebarToggleButton;
