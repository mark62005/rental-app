import { IManager } from "@/types/app/managers";
import { baseApi } from "./baseApi";
import { withToast } from "@/lib/utils";

export const managersApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		updateManagerSettings: builder.mutation<
			IManager,
			{ cognitoId: string } & Partial<IManager>
		>({
			query: ({ cognitoId, ...updatedManager }) => ({
				url: `managers/${cognitoId}`,
				method: "PUT",
				body: updatedManager,
			}),
			invalidatesTags: (result) => [{ type: "Managers", id: result?.id }],
			onQueryStarted: async (_, { queryFulfilled }) => {
				await withToast(queryFulfilled, {
					success: "Settings updated successfully.",
					error: "Failed to update settings. Please try again.",
				});
			},
		}),
	}),
});

export const { useUpdateManagerSettingsMutation } = managersApi;
