import { Property } from "../../generated/prisma";

export function verifyPropertyExistingInFavorites(
	propertyId: number,
	favorites: Property[]
): boolean {
	return favorites.some((fav: Property) => fav.id === propertyId);
}
