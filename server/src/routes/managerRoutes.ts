import { Router } from "express";
import {
	createManager,
	getManager,
	getPropertiesByManagerId,
	updateManager,
} from "../controllers/managerControllers";

const router = Router();

router.post("/", createManager);
router.get("/:cognitoId", getManager);
router.put("/:cognitoId", updateManager);
router.get("/:cognitoId/properties", getPropertiesByManagerId);

export default router;
