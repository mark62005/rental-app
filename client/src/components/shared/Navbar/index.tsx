"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "aws-amplify/auth";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { useGetAuthUserQuery } from "@/state/apis/authApi";
import { isDashboardPage } from "@/lib/utils";
import NotificationBadge from "./NotificationBadge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function Navbar() {
	const router = useRouter();
	const pathname = usePathname();
	const { data: authUser, isError } = useGetAuthUserQuery();

	function getLowerCasedUserRole(): string {
		return authUser?.userRole.toLowerCase() ?? "";
	}

	function navigateToDashboard() {
		if (authUser) {
			router.push(
				getLowerCasedUserRole() === "manager"
					? "/managers/properties"
					: "/tenants/favorites",
				{ scroll: false }
			);
		}
	}

	async function handleSignOut() {
		await signOut();
		window.location.href = "/";
	}

	return (
		<header
			className="fixed top-0 left-0 w-full z-50 shadow-xl"
			style={{ height: `${NAVBAR_HEIGHT}px` }}
		>
			<div className="flex justify-between items-center w-full py-3 px-8 bg-gray-700 text-gray-50">
				<div className="flex items-center gap-4 md:gap-6">
					<Link
						href="/"
						className="cursor-pointer hover:opacity-90"
						scroll={false}
					>
						<div className="flex items-center gap-3">
							<Image
								src="/logo.svg"
								alt="Rentiful Logo"
								width={24}
								height={24}
								className="size-6"
							/>
							<div className="text-xl font-bold">
								RENT
								<span className="text-secondary-500">IFUL</span>
							</div>
						</div>
					</Link>
				</div>

				{!isDashboardPage(pathname) && (
					<p className="text-gray-200 hidden md:block">
						Discover your perfect rental apartment with our advanced search
					</p>
				)}

				<div className="flex items-center gap-4">
					{authUser ? (
						<>
							<NotificationBadge />
							<NotificationBadge variant="message" />

							<DropdownMenu>
								<DropdownMenuTrigger className="flex items-center gap-2 cursor-pointer focus:outline-none hover:opacity-90">
									<Avatar>
										<AvatarImage src={authUser.userInfo?.image} />

										<AvatarFallback className="bg-gray-600">
											{authUser.userRole?.[0].toUpperCase()}
										</AvatarFallback>
									</Avatar>

									<p className="text-gray-200 hidden md:block">
										{authUser.userInfo?.name}
									</p>
								</DropdownMenuTrigger>

								<DropdownMenuContent className="bg-white text-gray-700">
									<DropdownMenuItem
										className="cursor-pointer hover:!bg-gray-700 hover:!text-gray-100 font-bold"
										onClick={navigateToDashboard}
									>
										Go to Dashboard
									</DropdownMenuItem>

									<DropdownMenuSeparator className="bg-gray-200" />

									<DropdownMenuItem
										className="cursor-pointer hover:!bg-gray-700 hover:!text-gray-100"
										onClick={() =>
											router.push(`/${getLowerCasedUserRole()}s/settings`, {
												scroll: false,
											})
										}
									>
										Settings
									</DropdownMenuItem>

									<DropdownMenuItem
										className="cursor-pointer hover:!bg-gray-700 hover:!text-gray-100"
										onClick={handleSignOut}
									>
										Sign out
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</>
					) : isError ? (
						<p className="text-destructive">User not found</p>
					) : (
						<>
							<Link href="/sign-in">
								<Button
									variant="outline"
									className="bg-transparent"
								>
									Sign In
								</Button>
							</Link>

							<Link href="/sign-up">
								<Button
									variant="secondary"
									className=""
								>
									Sign Up
								</Button>
							</Link>
						</>
					)}
				</div>
			</div>
		</header>
	);
}
export default Navbar;
