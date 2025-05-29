"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { MAIN_HEIGHT } from "@/lib/constants";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import {
	selectIsFiltersFullOpen,
	setFilters,
} from "@/state/slices/globalSlice";
import { cleanParams, cn } from "@/lib/utils";
import FiltersBar from "@/components/search/FiltersBar";
import FiltersFull from "@/components/search/FiltersFull";
import Listings from "@/components/search/Listings";
import Map from "@/components/search/Map";

function SearchPage() {
	const searchParams = useSearchParams();
	const dispatch = useAppDispatch();
	const isFiltersFullOpen = useAppSelector(selectIsFiltersFullOpen);

	useEffect(() => {
		const initialFilters = Array.from(searchParams.entries()).reduce(
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(acc: any, [key, value]) => {
				if (key === "priceRange" || key === "squareFeet") {
					acc[key] = value.split(",").map((v) => (v === "" ? null : Number(v)));
				} else if (key === "coordinates") {
					acc[key] = value.split(",").map(Number);
				} else {
					acc[key] = value === "any" ? null : value;
				}

				return acc;
			},
			{}
		);

		const cleanedFilters = cleanParams(initialFilters);
		dispatch(setFilters(cleanedFilters));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div
			className="w-full mx-auto px-5 flex flex-col"
			style={{ height: MAIN_HEIGHT }}
		>
			<FiltersBar />
			<div className="flex justify-between flex-1 overflow-hidden gap-3 mb-5">
				<div
					className={cn(
						"h-full overflow-auto transition-all duration-300 ease-in-out",
						isFiltersFullOpen
							? "w-3/12 opacity-100 visible"
							: "w-0 opacity-0 invisible"
					)}
				>
					<FiltersFull />
				</div>

				<Map />

				<div className="basis-4/12 overflow-y-auto">
					<Listings />
				</div>
			</div>
		</div>
	);
}
export default SearchPage;
