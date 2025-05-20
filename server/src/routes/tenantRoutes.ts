import { Router } from "express";
import {
	addFavoriteProperty,
	createTenant,
	getPropertiesByTenantId,
	getTenant,
	removeFavoriteProperty,
	updateTenant,
} from "../controllers/tenantControllers";

const router = Router();

router.post("/", createTenant);
router.get("/:cognitoId", getTenant);
router.put("/:cognitoId", updateTenant);
router.get("/:cognitoId/properties", getPropertiesByTenantId);
router.post("/:cognitoId/favorites/:propertyId", addFavoriteProperty);
router.delete("/:cognitoId/favorites/:propertyId", removeFavoriteProperty);

export default router;
