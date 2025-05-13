/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseQueryApi, FetchArgs } from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchAuthSession } from "aws-amplify/auth";

const customBaseQuery = async (
	args: string | FetchArgs,
	api: BaseQueryApi,
	extraOptions: any
): Promise<any> => {
	const baseQuery = fetchBaseQuery({
		baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
		prepareHeaders: async (headers) => {
			const session = await fetchAuthSession();
			const { idToken } = session.tokens ?? {};

			if (idToken) {
				headers.set("Authorization", `Bearer ${idToken}`);
			}
			return headers;
		},
	});

	try {
		const result: any = await baseQuery(args, api, extraOptions);

		if (result.error) {
			const errorData = result.error.data;
			const errorMessage =
				errorData?.message ||
				result.error.status.toString() ||
				"An error occured";

			// TODO: toast message
			console.log(errorMessage);
		}

		const isMutationRequest =
			(args as FetchArgs).method && (args as FetchArgs).method !== "GET";

		if (isMutationRequest) {
			const successMessage = result.data?.message;

			// TODO: toast message
			console.log(successMessage);
		}

		if (result.data) {
			result.data = result.data.data;
		} else if (
			result.error?.status === 204 ||
			result.meta?.response?.status === 24
		) {
			return { data: null };
		}

		return result;
	} catch (error: unknown) {
		const errorMessage =
			error instanceof Error ? error.message : "Unknown Error occured";

		return { error: { status: "FETCH_ERROR", message: errorMessage } };
	}
};

export const baseApi = createApi({
	baseQuery: customBaseQuery,
	reducerPath: "baseApi",
	tagTypes: ["Tenants"],
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	endpoints: (_builder) => ({}),
});
