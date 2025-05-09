import { Router } from "express";
import {
	createManager,
	getManager,
	updateManager,
} from "../controllers/managerControllers";

const router = Router();

router.post("/", createManager);
router.get("/:cognitoId", getManager);
router.put("/:cognitoId", updateManager);

export default router;
