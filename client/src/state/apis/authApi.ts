import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";
import { Manager as TManager, Tenant as TTenant } from "@/types/prismaTypes";
import { IUser } from "@/types/redux/api/auth";
import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
	endpoints: (buildler) => ({
		getAuthUser: buildler.query<IUser, void>({
			queryFn: async (_, _queryApi, _extraoptions, fetchWithBaseQuery) => {
				try {
					const session = await fetchAuthSession();
					const { idToken } = session.tokens ?? {};
					const userRole = idToken?.payload["custom:role"] as string;

					const user = await getCurrentUser();

					const endpoint =
						userRole === "manager"
							? `/managers/${user.userId}`
							: `/tenants/${user.userId}`;

					const userDetailsResponse = await fetchWithBaseQuery(endpoint);

					// TODO: If user doesn't exist, create new user in database

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
