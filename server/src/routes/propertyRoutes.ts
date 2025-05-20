import { Router } from "express";
import multer from "multer";
import {
	createProperty,
	getFilteredProperties,
	getPropertyWithId,
} from "../controllers/propertyControllers";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", getFilteredProperties);
router.post(
	"/",
	authMiddleware(["manager"]),
	upload.array("photos"),
	createProperty
);
router.get("/:id", getPropertyWithId);

export default router;
