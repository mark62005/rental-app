import { LayoutProps } from "@/types/app/page-props";
import StoreProvider from "@/state/redux";

function Providers({ children }: LayoutProps) {
	return <StoreProvider>{children}</StoreProvider>;
}
export default Providers;
