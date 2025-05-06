"use client";

import { DISCOVER_CONFIG } from "@/lib/constants";
import { motion } from "framer-motion";
import DiscoverCard from "./DiscoverCard";

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.2,
		},
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0 },
};

function DiscoverSection() {
	return (
		<motion.section
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, amount: 0.8 }}
			variants={containerVariants}
			className="py-12 bg-gray-50 mb-16"
		>
			<div className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
				<motion.div
					variants={itemVariants}
					className="my-12 text-center"
				>
					<h2 className="text-3xl font-semibold leading-tight text-gray-800">
						Discover
					</h2>

					<p className="mt-4 text-lg text-gray-600">
						Find your Dream Rental Property Today!
					</p>

					<p className="mt-2 text-gray-500 max-w-3xl mx-auto">
						Searching for your dream rental property has never been easier. With
						our user-friendly search feature, you can quickly find the perfect
						home that meets all your needs. Start your search today and discover
						your dream rental property!
					</p>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 xl:gap-16 text-center">
					{DISCOVER_CONFIG.map((item, index) => (
						<motion.div
							key={index}
							variants={itemVariants}
						>
							<DiscoverCard {...item} />
						</motion.div>
					))}
				</div>
			</div>
		</motion.section>
	);
}
export default DiscoverSection;
