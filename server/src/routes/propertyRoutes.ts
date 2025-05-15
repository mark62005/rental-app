import { Router } from "express";
import { getFilteredProperties } from "../controllers/propertyControllers";

const router = Router();

router.get("/", getFilteredProperties);

export default router;
