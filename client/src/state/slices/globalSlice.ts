import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../redux";

export interface IFilters {
	location: string;
	beds: string;
	baths: string;
	propertyType: string;
	amenities: string[];
	availableFrom: string;
	priceRange: [number, number] | [null, null];
	squareFeet: [number, number] | [null, null];
	coordinates: [number, number];
}

interface IInitialState {
	filters: IFilters;
	isFiltersFullOpen: boolean;
	viewMode: "grid" | "list";
}

export const initialState: IInitialState = {
	filters: {
		location: "Los Angeles",
		beds: "any",
		baths: "any",
		propertyType: "any",
		amenities: [],
		availableFrom: "any",
		priceRange: [null, null],
		squareFeet: [null, null],
		coordinates: [-118.25, 34.05],
	},
	isFiltersFullOpen: false,
	viewMode: "grid",
};

export const globalSlice = createSlice({
	name: "global",
	initialState,
	reducers: {
		setFilters: (state, action: PayloadAction<Partial<IFilters>>) => {
			state.filters = { ...state.filters, ...action.payload };
		},
		toggleFiltersFullOpen: (state) => {
			state.isFiltersFullOpen = !state.isFiltersFullOpen;
		},
		setViewMode: (state, action: PayloadAction<"grid" | "list">) => {
			state.viewMode = action.payload;
		},
	},
});

export const { setFilters, toggleFiltersFullOpen, setViewMode } =
	globalSlice.actions;

export function selectSearchFilters(state: RootState): IFilters {
	return state.global.filters;
}

export function selectIsFiltersFullOpen(state: RootState): boolean {
	return state.global.isFiltersFullOpen;
}

export function selectViewMode(state: RootState): "grid" | "list" {
	return state.global.viewMode;
}

export default globalSlice.reducer;
