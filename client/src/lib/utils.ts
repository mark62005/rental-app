import { FetchArgs } from "@reduxjs/toolkit/query/react";
import { AuthUser, JWT } from "aws-amplify/auth";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/* RTK QUERY API */
export async function createNewUserInDatabase(
	user: AuthUser,
	idToken: JWT | undefined,
	userRole: string,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	fetchWithBaseQuery: (arg: string | FetchArgs) => Promise<any>
): Promise<void> {
	const endpoint =
		userRole.toLowerCase() === "manager" ? "/managers" : "/tenants";

	const createUserResponse = await fetchWithBaseQuery({
		url: endpoint,
		method: "POST",
		body: {
			cognitoId: user.userId,
			name: user.username,
			email: idToken?.payload?.email || "",
			phoneNumber: "",
		},
	});

	if (createUserResponse.error) {
		throw new Error("Failed to create user record in database.");
	}
	return createUserResponse;
}
