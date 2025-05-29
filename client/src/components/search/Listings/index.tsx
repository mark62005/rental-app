import { useAppSelector } from "@/state/redux";
import { useGetAuthUserQuery } from "@/state/apis/authApi";
import {
	useAddFavoritePropertyMutation,
	useGetTenantQuery,
	useRemoveFavoritePropertyMutation,
} from "@/state/apis/tenantsApi";
import {
	selectSearchFilters,
	selectViewMode,
} from "@/state/slices/globalSlice";
import { useGetPropertiesQuery } from "@/state/apis/propertyApi";
import { ITenant } from "@/types/app/tenants";
import { verifyIsFavorite } from "@/lib/utils";
import Card from "./Card";
import CardCompact from "./CardCompact";

function Listings() {
	const [addToFavorites] = useAddFavoritePropertyMutation();
	const [removeFromFavorites] = useRemoveFavoritePropertyMutation();
	const viewMode = useAppSelector(selectViewMode);
	const filters = useAppSelector(selectSearchFilters);

	const { data: authUser } = useGetAuthUserQuery();
	const { data: tenant } = useGetTenantQuery(
		authUser?.cognitoInfo?.userId || "",
		{
			skip: !authUser?.cognitoInfo?.userId,
		}
	);

	const {
		data: properties,
		isLoading,
		isError,
	} = useGetPropertiesQuery(filters);

	async function handleFavoriteToggle(propertyId: number) {
		if (!authUser) return;

		const userInfo = authUser.userInfo as ITenant;

		const isFavorites = verifyIsFavorite(propertyId, userInfo.favorites);

		if (isFavorites) {
			await removeFromFavorites({
				cognitoId: authUser.cognitoInfo.userId,
				propertyId,
			});
		} else {
			await addToFavorites({
				cognitoId: authUser.cognitoInfo.userId,
				propertyId,
			});
		}
	}

	if (isLoading) return <>Loading...</>;
	if (isError || !properties) return <div>Failed to fetch properties</div>;

	return (
		<div className="w-full">
			<h3 className="text-sm font-bold px-4">
				{properties.length}{" "}
				<span className="text-gray-700 font-normal">
					Places in {filters.location}
				</span>
			</h3>

			<div className="flex">
				<div className="w-full p-4">
					{properties.map((property) =>
						viewMode === "grid" ? (
							<Card
								key={property.id}
								property={property}
								isFavorite={verifyIsFavorite(property.id, tenant?.favorites)}
								onFavoriteToggle={() => handleFavoriteToggle(property.id)}
								showFavoriteButton={!!authUser}
								propertyLink={`/search/${property.id}`}
							/>
						) : (
							<CardCompact
								key={property.id}
								property={property}
								isFavorite={verifyIsFavorite(property.id, tenant?.favorites)}
								onFavoriteToggle={() => handleFavoriteToggle(property.id)}
								showFavoriteButton={!!authUser}
								propertyLink={`/search/${property.id}`}
							/>
						)
					)}
				</div>
			</div>
		</div>
	);
}
export default Listings;
