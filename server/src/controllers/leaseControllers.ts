import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export async function getAllLeases(req: Request, res: Response): Promise<void> {
	console.log("/ GET called");

	try {
		const leases = await prisma.lease.findMany({
			include: {
				tenant: true,
				property: true,
			},
		});

		res.status(200).json({ data: leases });
	} catch (error) {
		console.error("Error retrieving leases: ", error);
		res.status(500).json({ message: "Error retrieving leases." });
	}
}

export async function getPaymentsOfALease(
	req: Request,
	res: Response
): Promise<void> {
	console.log("/:id/payments GET called");

	try {
		const { id } = req.params;

		const lease = await prisma.lease.findUnique({
			where: { id: Number(id) },
		});
		if (!lease) {
			res.status(404).json({ message: "Lease not found." });
			return;
		}

		const payments = await prisma.payment.findMany({
			where: { leaseId: Number(id) },
		});

		res.status(200).json({ data: payments });
	} catch (error) {
		console.error("Error retrieving lease payments: ", error);
		res.status(500).json({ message: "Error retrieving lease payments." });
	}
}
