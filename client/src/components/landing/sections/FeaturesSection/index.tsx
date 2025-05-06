"use client";

import { motion } from "framer-motion";
import { FEATURES_CONFIG } from "@/lib/constants";
import FeatureCard from "./FeatureCard";

const containerVariants = {
	hidden: { opacity: 0, y: 50 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.5,
			staggerChildren: 0.2,
		},
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0 },
};

function FeaturesSection() {
	return (
		<motion.section
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true }}
			variants={containerVariants}
			className="py-24 px-6 sm:px-8 lg:px-12 xl:px-16 bg-gray-50"
		>
			<div className="max-w-4xl xl:max-w-6xl mx-auto">
				<motion.h2
					variants={itemVariants}
					className="text-3xl font-bold text-center mb-12 w-full sm:w-2/3 mx-auto"
				>
					Quickly find the home you want using our effective search filters!
				</motion.h2>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 xl:gap-16">
					{FEATURES_CONFIG.map((feature) => (
						<motion.div
							key={feature.href}
							variants={itemVariants}
						>
							<FeatureCard featureLink={feature} />
						</motion.div>
					))}
				</div>
			</div>
		</motion.section>
	);
}
export default FeaturesSection;
