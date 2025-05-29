import { IProperty } from "@/types/app/properties";
import { IFilters } from "../slices/globalSlice";
import { baseApi } from "./baseApi";
import { cleanParams, withToast } from "@/lib/utils";

export const propertyApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getProperty: builder.query<IProperty, number>({
			query: (id) => `properties/${id}`,
			providesTags: (result, error, id) => [{ type: "PropertyDetails", id }],
			async onQueryStarted(_, { queryFulfilled }) {
				await withToast(queryFulfilled, {
					error: "Failed to load property details.",
				});
			},
		}),
		getProperties: builder.query<
			IProperty[],
			Partial<IFilters> & { favoriteIds?: number[] }
		>({
			query: (filters) => {
				const params = cleanParams({
					location: filters.location,
					priceMin: filters.priceRange?.[0],
					priceMax: filters.priceRange?.[1],
					beds: filters.beds,
					baths: filters.baths,
					propertyType: filters.propertyType,
					squareFeetMin: filters.squareFeet?.[0],
					squareFeetMax: filters.squareFeet?.[1],
					amenities: filters.amenities?.join(","),
					availableFrom: filters.availableFrom,
					favoriteIds: filters.favoriteIds?.join(","),
					latitude: filters.coordinates?.[1],
					longitude: filters.coordinates?.[0],
				});

				return { url: "properties", params };
			},
			providesTags: (result) =>
				result
					? [
							...result.map(({ id }) => ({ type: "Properties" as const, id })),
							{ type: "Properties", id: "LIST" },
						]
					: [{ type: "Properties", id: "LIST" }],
			async onQueryStarted(_, { queryFulfilled }) {
				await withToast(queryFulfilled, {
					error: "Failed to fetch properties.",
				});
			},
		}),
	}),
});

export const { useGetPropertiesQuery, useGetPropertyQuery } = propertyApi;
