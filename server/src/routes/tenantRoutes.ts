import { Router } from "express";
import {
	createTenant,
	getTenant,
	updateTenant,
} from "../controllers/tenantControllers";

const router = Router();

router.post("/", createTenant);
router.get("/:cognitoId", getTenant);
router.put("/:cognitoId", updateTenant);

export default router;
