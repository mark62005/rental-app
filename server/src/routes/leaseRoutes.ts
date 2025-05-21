import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
	getAllLeases,
	getPaymentsOfALease,
} from "../controllers/leaseControllers";

const router = Router();

router.get("/", authMiddleware(["manager", "tenant"]), getAllLeases);
router.get(
	"/:id/payments",
	authMiddleware(["manager", "tenant"]),
	getPaymentsOfALease
);

export default router;
