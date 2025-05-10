import { AuthUser, fetchAuthSession, getCurrentUser } from "aws-amplify/auth";
import { Manager as TManager, Tenant as TTenant } from "@/types/prismaTypes";
import { IUser } from "@/types/redux/api/auth";
import { baseApi } from "./baseApi";
import { createNewUserInDatabase } from "@/lib/utils";

export const authApi = baseApi.injectEndpoints({
	endpoints: (buildler) => ({
		getAuthUser: buildler.query<IUser, void>({
			queryFn: async (_, _queryApi, _extraoptions, fetchWithBaseQuery) => {
				try {
					const session = await fetchAuthSession();
					const { idToken } = session.tokens ?? {};
					const userRole = idToken?.payload["custom:role"] as string;

					const user: AuthUser = await getCurrentUser();

					const endpoint =
						userRole === "manager"
							? `/managers/${user.userId}`
							: `/tenants/${user.userId}`;

					let userDetailsResponse = await fetchWithBaseQuery(endpoint);

					// If user doesn't exist, create new user in database
					if (
						userDetailsResponse.error &&
						userDetailsResponse.error.status === 404
					) {
						userDetailsResponse = await createNewUserInDatabase(
							user,
							idToken,
							userRole,
							fetchWithBaseQuery
						);
					}

					return {
						data: {
							cognitoInfo: { ...user },
							userInfo: userDetailsResponse.data as TTenant | TManager,
							userRole,
						},
					};
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
				} catch (error: any) {
					return { error: error.message || "Error fetching user data." };
				}
			},
		}),
	}),
});

export const { useGetAuthUserQuery } = authApi;
