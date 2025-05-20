import { Router } from "express";
import {
	createTenant,
	getPropertiesByTenantId,
	getTenant,
	updateTenant,
} from "../controllers/tenantControllers";

const router = Router();

router.post("/", createTenant);
router.get("/:cognitoId", getTenant);
router.put("/:cognitoId", updateTenant);
router.get("/:cognitoId/properties", getPropertiesByTenantId);

export default router;
