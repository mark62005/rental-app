"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function HeroSection() {
	const [searchQuery, setSearchQuery] = useState("");

	function handleLocationSearch() {
		console.log("Location search clicked.");

		// TODO: Location search functionality
	}

	return (
		<section className="relative h-screen">
			<Image
				src="/landing-splash.jpg"
				alt="Rentiful Rental Platform Hero Section"
				fill
				className="object-cover object-center"
				priority
			/>

			<div className="absolute inset-0 bg-black opacity-60" />

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
				className="absolute top-1/3 text-center w-full"
			>
				<div className="max-w-4xl mx-auto px-16 sm:px-12">
					<h1 className="text-5xl font-bold text-gray-50 mb-4">
						Start your journey to finding the perfect place to call home
					</h1>
					<p className="text-xl text-gray-50 mb-8">
						Explore our wide range of rental properties tailored to fit your
						lifestyle and needs!
					</p>

					<div className="flex justify-center">
						<Input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value.trim())}
							placeholder="Search by city, neighborhood or address"
							className="w-full max-w-lg rounded-none rounded-l-xl border-none bg-gray-50 h-12"
						/>

						<Button
							variant="secondary"
							onClick={handleLocationSearch}
							className="rounded-none rounded-r-xl border-none h-12"
						>
							Search
						</Button>
					</div>
				</div>
			</motion.div>
		</section>
	);
}
export default HeroSection;
