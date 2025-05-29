import { IProperty } from "@/types/app/properties";
import { IMutationMessage } from "@/types/app/utils";
import { FetchArgs } from "@reduxjs/toolkit/query/react";
import { AuthUser, JWT } from "aws-amplify/auth";
import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function capitalize(word: string): string {
	if (word.length === 0) {
		return "";
	}

	if (word.length === 1) {
		return word.toUpperCase();
	}
	return word.charAt(0).toUpperCase() + word.slice(1);
}

export function isDashboardPage(pathname: string): boolean {
	return pathname.startsWith("/managers") || pathname.includes("/tenants");
}

/* TOAST */
export async function withToast<T>(
	mutationFn: Promise<T>,
	messages: IMutationMessage
): Promise<T> {
	const { success, error } = messages;

	try {
		const result = await mutationFn;

		if (success) toast.success(success);
		return result;
	} catch (err) {
		if (error) toast.error(error);
		throw err;
	}
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cleanParams(params: Record<string, any>): Record<string, any> {
	return Object.fromEntries(
		Object.entries(params).filter(
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			([_, value]) =>
				value !== undefined &&
				value !== "any" &&
				value !== "" &&
				(Array.isArray(value) ? value.some((v) => v !== null) : value !== null)
		)
	);
}

export function formatPriceValue(value: number | null, isMin: boolean) {
	if (value === null || value === 0)
		return isMin ? "Any Min Price" : "Any Max Price";
	if (value >= 1000) {
		const kValue = value / 1000;
		return isMin ? `$${kValue}k+` : `<$${kValue}k`;
	}
	return isMin ? `$${value}+` : `<$${value}`;
}

export function formatEnumString(str: string) {
	return str.replace(/([A-Z])/g, " $1").trim();
}

export function verifyIsFavorite(
	propertyId: number,
	favorites?: IProperty[]
): boolean {
	if (!favorites || favorites.length === 0) return false;

	return favorites.some((fav: IProperty) => fav.id === propertyId);
}
