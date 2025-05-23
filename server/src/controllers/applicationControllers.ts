import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";
import { formatApplications } from "../lib/utils/applications";

const prisma = new PrismaClient();

export async function getApplicationsOfAUser(
	req: Request,
	res: Response
): Promise<void> {
	console.log("/ GET called");

	try {
		const { userId, userRole } = req.query;

		if (!userId || !userRole) {
			res.status(400).json({ message: "User ID and role are required." });
			return;
		}

		let whereClause = {};
		if (userRole === "tenant") {
			whereClause = {
				tenantCognitoId: String(userId),
			};
		} else if (userRole === "manager") {
			whereClause = {
				managerCognitoId: String(userId),
			};
		}

		const applications = await prisma.application.findMany({
			where: whereClause,
			include: {
				property: {
					include: {
						location: true,
						manager: true,
					},
				},
				tenant: true,
			},
		});

		const formattedApplications = await formatApplications(
			applications,
			prisma
		);

		console.log(formattedApplications);
		res.status(200).json({ data: formattedApplications });
	} catch (error) {
		console.error("Error retrieving applications: ", error);
		res.status(500).json({ message: "Error retrieving applications." });
	}
}

export async function createApplication(
	req: Request,
	res: Response
): Promise<void> {
	console.log("/ POST called");

	try {
		const {
			applicationDate,
			status,
			propertyId,
			tenantCognitoId,
			name,
			email,
			phoneNumber,
			message,
		} = req.body;

		const property = await prisma.property.findUnique({
			where: { id: propertyId },
			select: { pricePerMonth: true, securityDeposit: true },
		});

		if (!property) {
			res.status(404).json({ message: "Property not found" });
			return;
		}

		const newApplication = await prisma.$transaction(async (prisma) => {
			// Create lease first
			const lease = await prisma.lease.create({
				data: {
					startDate: new Date(), // Today
					endDate: new Date(
						new Date().setFullYear(new Date().getFullYear() + 1)
					), // 1 year from today
					rent: property.pricePerMonth,
					deposit: property.securityDeposit,
					property: {
						connect: { id: propertyId },
					},
					tenant: {
						connect: { cognitoId: tenantCognitoId },
					},
				},
			});

			// Then create application with lease connection
			const application = await prisma.application.create({
				data: {
					applicationDate: new Date(applicationDate),
					status,
					name,
					email,
					phoneNumber,
					message,
					property: {
						connect: { id: propertyId },
					},
					tenant: {
						connect: { cognitoId: tenantCognitoId },
					},
					lease: {
						connect: { id: lease.id },
					},
				},
				include: {
					property: true,
					tenant: true,
					lease: true,
				},
			});

			return application;
		});

		res.status(200).json({ data: newApplication });
	} catch (error) {
		console.error("Error creating application: ", error);
		res.status(500).json({ message: "Error creating application." });
	}
}

export async function updateApplicationStatus(
	req: Request,
	res: Response
): Promise<void> {
	console.log("/:id/status PUT called");

	try {
		const { id } = req.params;
		const { status } = req.body;

		const application = await prisma.application.findUnique({
			where: { id: Number(id) },
			include: {
				property: true,
				tenant: true,
			},
		});

		if (!application) {
			res.status(404).json({ message: "Application not found." });
			return;
		}

		if (status === "Approved") {
			const newLease = await prisma.lease.create({
				data: {
					startDate: new Date(),
					endDate: new Date(
						new Date().setFullYear(new Date().getFullYear() + 1)
					),
					rent: application.property.pricePerMonth,
					deposit: application.property.securityDeposit,
					propertyId: application.propertyId,
					tenantCognitoId: application.tenantCognitoId,
				},
			});

			// Update the property to connect the tenant
			await prisma.property.update({
				where: { id: application.propertyId },
				data: {
					tenants: {
						connect: { cognitoId: application.tenantCognitoId },
					},
				},
			});

			// Update the application with the new lease ID
			await prisma.application.update({
				where: { id: Number(id) },
				data: { status, leaseId: newLease.id },
				include: {
					property: true,
					tenant: true,
					lease: true,
				},
			});
		} else {
			// Update the application status (for both "Denied" and other statuses)
			await prisma.application.update({
				where: { id: Number(id) },
				data: { status },
			});
		}

		// Respond with the updated application details
		const updatedApplication = await prisma.application.findUnique({
			where: { id: Number(id) },
			include: {
				property: true,
				tenant: true,
				lease: true,
			},
		});

		res.status(200).json({ data: updatedApplication });
	} catch (error) {
		console.error("Error updating application status: ", error);
		res.status(500).json({ message: "Error updating application status." });
	}
}
