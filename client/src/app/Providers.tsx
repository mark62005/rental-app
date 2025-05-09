"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import { LayoutProps } from "@/types/app/page-props";
import StoreProvider from "@/state/redux";
import AuthProvider from "./(auth)/AuthProvider";

function Providers({ children }: LayoutProps) {
	return (
		<StoreProvider>
			<Authenticator.Provider>
				<AuthProvider>{children}</AuthProvider>
			</Authenticator.Provider>
		</StoreProvider>
	);
}
export default Providers;
