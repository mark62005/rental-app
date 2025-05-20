import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";
import { wktToGeoJSON } from "@terraformer/wkt";

const prisma = new PrismaClient();

export async function getTenant(req: Request, res: Response): Promise<void> {
	console.log("/:cognitoId GET called");

	try {
		const { cognitoId } = req.params;
		const tenant = await prisma.tenant.findUnique({
			where: { cognitoId },
			include: {
				favorites: true,
			},
		});

		if (!tenant) {
			res.status(404).json({ message: "404 Tenant not found." });
			return;
		}

		res.status(200).json({ data: tenant });
	} catch (error) {
		console.error("Error retrieving tenant: ", error);
		res.status(500).json({ message: "Error retrieving tenant." });
	}
}

export async function createTenant(req: Request, res: Response): Promise<void> {
	console.log("/ POST called");

	try {
		const { cognitoId, name, email, phoneNumber } = req.body;

		if (
			!cognitoId ||
			!name ||
			name.trim() === "" ||
			!email ||
			email.trim() === ""
		) {
			res
				.status(400)
				.json({ message: "Bad Request. ID, name or email is missing." });
			return;
		}

		const newTenant = await prisma.tenant.create({
			data: {
				cognitoId,
				name: name.trim(),
				email: email.trim(),
				phoneNumber,
			},
		});

		console.log(`Tenant id: ${cognitoId} has been created successfully.`);
		res.status(200).json({ data: newTenant });
	} catch (error) {
		console.error("Error creating tenant: ", error);
		res.status(500).json({ message: "Error creating tenant." });
	}
}

export async function updateTenant(req: Request, res: Response): Promise<void> {
	console.log("/:cognitoId PUT called");

	try {
		const { cognitoId } = req.params;
		const { name, email, phoneNumber } = req.body;

		const tenant = await prisma.tenant.findUnique({ where: { cognitoId } });
		if (!tenant) {
			res.status(404).json({ message: "Tenant not found." });
			return;
		}

		await prisma.tenant.update({
			where: { cognitoId },
			data: { name, email, phoneNumber },
		});

		console.log(`Tenant id: ${cognitoId} has been updated successfully.`);
		res.status(200).json({ data: tenant });
	} catch (error) {
		console.error("Error updating tenant: ", error);
		res.status(500).json({ message: "Error updating tenant." });
	}
}

export const getPropertiesByTenantId = async (
	req: Request,
	res: Response
): Promise<void> => {
	console.log("/:cognitoId/properties GET called");

	try {
		const { cognitoId } = req.params;
		const properties = await prisma.property.findMany({
			where: { tenants: { some: { cognitoId } } },
			include: {
				location: true,
			},
		});

		const residencesWithFormattedLocation = await Promise.all(
			properties.map(async (property) => {
				const coordinates: { coordinates: string }[] =
					await prisma.$queryRaw`SELECT ST_asText(coordinates) as coordinates from "Location" where id = ${property.location.id}`;

				const geoJSON: any = wktToGeoJSON(coordinates[0]?.coordinates || "");
				const longitude = geoJSON.coordinates[0];
				const latitude = geoJSON.coordinates[1];

				return {
					...property,
					location: {
						...property.location,
						coordinates: {
							longitude,
							latitude,
						},
					},
				};
			})
		);

		res.status(200).json({ data: residencesWithFormattedLocation });
	} catch (error) {
		console.error("Error retrieving residences: ", error);
		res.status(500).json({ message: `Error retrieving residences: ${error}` });
	}
};
