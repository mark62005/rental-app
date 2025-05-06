import CTASection from "@/components/landing/sections/CTASection";
import DiscoverSection from "@/components/landing/sections/DiscoverSection";
import FeaturesSection from "@/components/landing/sections/FeaturesSection";
import FooterSection from "@/components/landing/sections/FooterSection";
import HeroSection from "@/components/landing/sections/HeroSection";

function LandingPage() {
	return (
		<>
			<HeroSection />
			<FeaturesSection />
			<DiscoverSection />
			<CTASection />
			<FooterSection />
		</>
	);
}
export default LandingPage;
