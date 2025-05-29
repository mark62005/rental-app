import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import {
	IFilters,
	selectIsFiltersFullOpen,
	selectSearchFilters,
	selectViewMode,
	setFilters,
	setViewMode,
	toggleFiltersFullOpen,
} from "@/state/slices/globalSlice";
import { debounce } from "lodash";
import { PropertyTypeIcons } from "@/lib/constants";
import { cleanParams, cn, formatPriceValue } from "@/lib/utils";
import { Filter, Grid, List, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

function FiltersBar() {
	const router = useRouter();
	const pathname = usePathname();
	const dispatch = useAppDispatch();
	const filters = useAppSelector(selectSearchFilters);
	const isFiltersFullOpen = useAppSelector(selectIsFiltersFullOpen);
	const viewMode = useAppSelector(selectViewMode);
	const [searchInput, setSearchInput] = useState(filters.location);

	const updateUrl = debounce((newFilters: IFilters) => {
		const cleanFilters = cleanParams(newFilters);
		const updatedSearchParams = new URLSearchParams();

		Object.entries(cleanFilters).forEach(([key, value]) => {
			updatedSearchParams.set(
				key,
				Array.isArray(value) ? value.join(",") : value.toString()
			);
		});

		router.push(`${pathname}?${updatedSearchParams.toString()}`);
	});

	function handleFilterChange(
		key: string,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		value: any,
		isMin?: boolean
	): void {
		let newValue = value;

		if (key === "priceRange" || key === "squareFeet") {
			const currentArrayRange = [...filters[key]];

			if (isMin) {
				const index = isMin ? 0 : 1;
				currentArrayRange[index] = value === "any" ? null : Number(value);
			}
			newValue = currentArrayRange;
		} else if (key === "coordinates") {
			newValue = value === "any" ? [0, 0] : value.map(Number);
		} else {
			newValue = value === "any" ? "any" : value;
		}

		const newFilters = { ...filters, [key]: newValue };

		dispatch(setFilters(newFilters));
		updateUrl(newFilters);
	}

	async function handleLocationSearch() {
		try {
			const response = await fetch(
				`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
					searchInput
				)}.json?access_token=${
					process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
				}&fuzzyMatch=true`
			);

			const data = await response.json();
			if (data.features && data.features.length > 0) {
				const [lng, lat] = data.features[0].center;
				dispatch(
					setFilters({
						location: searchInput,
						coordinates: [lng, lat],
					})
				);
			}
		} catch (error) {
			console.error("Error searching location: ", error);
		}
	}

	return (
		<div className="flex justify-between items-center w-full py-5">
			{/* FILTERS */}
			<div className="flex justify-between items-center gap-4 p-2">
				{/* ALL FILTERS */}
				<Button
					variant="outline"
					className={cn(
						"gap-2 rounded-xl border-gray-400 hover:bg-gray-500 hover:text-gray-100",
						isFiltersFullOpen && "bg-gray-700 text-gray-100"
					)}
					onClick={() => dispatch(toggleFiltersFullOpen())}
				>
					<Filter className="size-4" />
					All Filters
				</Button>

				{/* SEARCH LOCATION */}
				<div className="flex items-center">
					<Input
						placeholder="Search location"
						value={searchInput}
						onChange={(e) => setSearchInput(e.target.value.trim())}
						className="w-40 rounded-l-xl rounded-r-none border-gray-400 border-r-0"
					/>

					<Button
						onClick={handleLocationSearch}
						className={`rounded-r-xl rounded-l-none border-l-none border-gray-400 shadow-none 
              border hover:bg-gray-700 hover:text-gray-50`}
					>
						<Search className="size-4" />
					</Button>
				</div>

				{/* PRICE RANGE */}
				<div className="flex gap-1">
					{/* MIN PRICE SELECTOR */}
					<Select
						value={filters.priceRange[0]?.toString() || "any"}
						onValueChange={(value) =>
							handleFilterChange("priceRange", value, true)
						}
					>
						<SelectTrigger className="w-22 rounded-xl border-gray-400">
							<SelectValue>
								{formatPriceValue(filters.priceRange[0], true)}
							</SelectValue>
						</SelectTrigger>

						<SelectContent className="bg-white">
							<SelectItem value="any">Any Min Price</SelectItem>
							{[500, 1000, 1500, 2000, 3000, 5000, 10000].map((price) => (
								<SelectItem
									key={price}
									value={price.toString()}
								>
									${price / 1000}k+
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					{/* Maximum Price Selector */}
					<Select
						value={filters.priceRange[1]?.toString() || "any"}
						onValueChange={(value) =>
							handleFilterChange("priceRange", value, false)
						}
					>
						<SelectTrigger className="w-22 rounded-xl border-gray-400">
							<SelectValue>
								{formatPriceValue(filters.priceRange[1], false)}
							</SelectValue>
						</SelectTrigger>

						<SelectContent className="bg-white">
							<SelectItem value="any">Any Max Price</SelectItem>
							{[1000, 2000, 3000, 5000, 10000].map((price) => (
								<SelectItem
									key={price}
									value={price.toString()}
								>
									&lt;${price / 1000}k
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Beds and Baths */}
				<div className="flex gap-1">
					{/* Beds */}
					<Select
						value={filters.beds}
						onValueChange={(value) => handleFilterChange("beds", value)}
					>
						<SelectTrigger className="w-26 rounded-xl border-gray-400">
							<SelectValue placeholder="Beds" />
						</SelectTrigger>
						<SelectContent className="bg-white">
							<SelectItem value="any">Any Beds</SelectItem>
							<SelectItem value="1">1+ bed</SelectItem>
							<SelectItem value="2">2+ beds</SelectItem>
							<SelectItem value="3">3+ beds</SelectItem>
							<SelectItem value="4">4+ beds</SelectItem>
						</SelectContent>
					</Select>

					{/* Baths */}
					<Select
						value={filters.baths}
						onValueChange={(value) => handleFilterChange("baths", value)}
					>
						<SelectTrigger className="w-26 rounded-xl border-gray-400">
							<SelectValue placeholder="Baths" />
						</SelectTrigger>
						<SelectContent className="bg-white">
							<SelectItem value="any">Any Baths</SelectItem>
							<SelectItem value="1">1+ bath</SelectItem>
							<SelectItem value="2">2+ baths</SelectItem>
							<SelectItem value="3">3+ baths</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Property Type */}
				<Select
					value={filters.propertyType || "any"}
					onValueChange={(value) => handleFilterChange("propertyType", value)}
				>
					<SelectTrigger className="w-32 rounded-xl border-gray-400">
						<SelectValue placeholder="Home Type" />
					</SelectTrigger>

					<SelectContent className="bg-white">
						<SelectItem value="any">Any Property Type</SelectItem>

						{Object.entries(PropertyTypeIcons).map(([type, Icon]) => (
							<SelectItem
								key={type}
								value={type}
							>
								<div className="flex items-center">
									<Icon className="size-4 mr-2" />
									<span>{type}</span>
								</div>
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* View Mode */}
			<div className="flex justify-between items-center gap-4 p-2">
				<div className="flex border rounded-xl">
					<Button
						variant="ghost"
						className={cn(
							"px-3 py-1 rounded-none rounded-l-xl hover:bg-gray-600 hover:text-gray-50",
							viewMode === "list" ? "bg-gray-700 text-gray-50" : ""
						)}
						onClick={() => dispatch(setViewMode("list"))}
					>
						<List className="size-5" />
					</Button>
					<Button
						variant="ghost"
						className={cn(
							"px-3 py-1 rounded-none rounded-r-xl hover:bg-gray-600 hover:text-gray-50",
							viewMode === "grid" ? "bg-gray-700 text-gray-50" : ""
						)}
						onClick={() => dispatch(setViewMode("grid"))}
					>
						<Grid className="size-5" />
					</Button>
				</div>
			</div>
		</div>
	);
}
export default FiltersBar;
