import { ITenant } from "@/types/app/tenants";
import { baseApi } from "./baseApi";
import { withToast } from "@/lib/utils";

export const tenantsApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getTenant: builder.query<ITenant, string>({
			query: (cognitoId) => `tenants/${cognitoId}`,
			providesTags: (result) => [{ type: "Tenants", id: result?.id }],
			async onQueryStarted(_, { queryFulfilled }) {
				await withToast(queryFulfilled, {
					error: "Failed to load tenant profile.",
				});
			},
		}),
		updateTenantSettings: builder.mutation<
			ITenant,
			{ cognitoId: string } & Partial<ITenant>
		>({
			query: ({ cognitoId, ...updatedTenant }) => ({
				url: `tenants/${cognitoId}`,
				method: "PUT",
				body: updatedTenant,
			}),
			invalidatesTags: (result) => [{ type: "Tenants", id: result?.id }],
			onQueryStarted: async (_, { queryFulfilled }) => {
				await withToast(queryFulfilled, {
					success: "Settings updated successfully.",
					error: "Failed to update settings. Please try again.",
				});
			},
		}),
		addFavoriteProperty: builder.mutation<
			ITenant,
			{
				cognitoId: string;
				propertyId: number;
			}
		>({
			query: ({ cognitoId, propertyId }) => ({
				url: `tenants/${cognitoId}/favorites/${propertyId}`,
				method: "POST",
			}),
			invalidatesTags: (result) => [
				{ type: "Tenants", id: result?.id },
				{ type: "Properties", id: "LIST" },
			],
			onQueryStarted: async (_, { queryFulfilled }) => {
				await withToast(queryFulfilled, {
					success: "Added to favorites!",
					error: "Failed to add to favorites",
				});
			},
		}),
		removeFavoriteProperty: builder.mutation<
			ITenant,
			{ cognitoId: string; propertyId: number }
		>({
			query: ({ cognitoId, propertyId }) => ({
				url: `tenants/${cognitoId}/favorites/${propertyId}`,
				method: "DELETE",
			}),
			invalidatesTags: (result) => [
				{ type: "Tenants", id: result?.id },
				{ type: "Properties", id: "LIST" },
			],
			async onQueryStarted(_, { queryFulfilled }) {
				await withToast(queryFulfilled, {
					success: "Removed from favorites!",
					error: "Failed to remove from favorites.",
				});
			},
		}),
	}),
});

export const {
	useGetTenantQuery,
	useUpdateTenantSettingsMutation,
	useAddFavoritePropertyMutation,
	useRemoveFavoritePropertyMutation,
} = tenantsApi;
