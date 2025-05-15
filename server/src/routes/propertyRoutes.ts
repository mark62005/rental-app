import { Router } from "express";
import {
	getFilteredProperties,
	getPropertyWithId,
} from "../controllers/propertyControllers";

const router = Router();

router.get("/", getFilteredProperties);
router.get("/:id", getPropertyWithId);

export default router;
