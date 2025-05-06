"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

function CTASection() {
	function handleSearchButtonClick() {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}

	return (
		<section className="relative py-24">
			<Image
				src="/landing-call-to-action.jpg"
				alt="Rentiful Search Section Background"
				fill
				className="object-cover object-center"
			/>

			<div className="absolute inset-0 bg-black opacity-60" />

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				transition={{ duration: 0.5 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				className="relative max-w-4xl xl:max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 py-12"
			>
				<div className="flex flex-col md:flex-row justify-between items-center">
					<div className="mb-6 md:mb-0 md:mr-10">
						<h2 className="text-2xl font-bold text-white">
							Find Your Dream Rental Property
						</h2>
					</div>

					<div>
						<p className="text-gray-50 mb-3">
							Discover a wide range of rental properties in your desired
							location.
						</p>

						<div className="flex justify-center md:justify-start gap-4">
							<Button
								variant="outline"
								size="lg"
								onClick={handleSearchButtonClick}
							>
								Search
							</Button>

							<Link
								href="/signup"
								scroll={false}
							>
								<Button
									variant="secondary"
									size="lg"
								>
									Sign Up
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</motion.div>
		</section>
	);
}
export default CTASection;
