import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
	createApplication,
	getApplicationsOfAUser,
	updateApplicationStatus,
} from "../controllers/applicationControllers";

const router = express.Router();

router.get("/", authMiddleware(["manager", "tenant"]), getApplicationsOfAUser);
router.post("/", authMiddleware(["tenant"]), createApplication);
router.put("/:id/status", authMiddleware(["manager"]), updateApplicationStatus);

export default router;
