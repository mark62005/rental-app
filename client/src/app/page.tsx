import Navbar from "@/components/shared/Navbar";
import LandingPage from "./(nondashboard)/landing/page";

export default function Home() {
	return (
		<div className="h-full w-full">
			<Navbar />

			<main className="flex flex-col h-full w-full">
				<LandingPage />
			</main>
		</div>
	);
}
