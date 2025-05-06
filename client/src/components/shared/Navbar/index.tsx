import Image from "next/image";
import Link from "next/link";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { Button } from "@/components/ui/button";

function Navbar() {
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

				<p className="text-gray-200 hidden md:block">
					Discover your perfect rental apartment with our advanced search
				</p>

				<div className="flex items-center gap-4">
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
				</div>
			</div>
		</header>
	);
}
export default Navbar;
