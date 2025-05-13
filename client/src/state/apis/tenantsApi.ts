import { ITenant } from "@/types/app/tenants";
import { baseApi } from "./baseApi";
import { withToast } from "@/lib/utils";

export const tenantsApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
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
	}),
});

export const { useUpdateTenantSettingsMutation } = tenantsApi;
