import { NotificationBadgeProps } from "@/types/app/component-props";
import { Bell, MessageCircle } from "lucide-react";

function NotificationBadge({
	variant = "notification",
}: NotificationBadgeProps) {
	const iconClassName = "size-6 cursor-pointer text-gray-200";

	return (
		<div className="relative hidden md:block hover:opacity-90">
			{variant === "notification" ? (
				<MessageCircle className={iconClassName} />
			) : (
				<Bell className={iconClassName} />
			)}
			<span className="absolute top-0 right-0 size-2 bg-secondary-700 rounded-full"></span>
		</div>
	);
}
export default NotificationBadge;
