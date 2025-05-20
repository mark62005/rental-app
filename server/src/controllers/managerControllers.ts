import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";
import { wktToGeoJSON } from "@terraformer/wkt";

const prisma = new PrismaClient();

export async function getManager(req: Request, res: Response): Promise<void> {
	console.log("/:cognitoId GET called");

	try {
		const { cognitoId } = req.params;
		const manager = await prisma.manager.findUnique({
			where: { cognitoId },
		});

		if (!manager) {
			res.status(404).json({ message: "Manager not found." });
			return;
		}

		res.status(200).json({ data: manager });
	} catch (error) {
		console.error("Error retrieving manager: ", error);
		res.status(500).json({ message: "Error retrieving manager." });
	}
}

export async function createManager(
	req: Request,
	res: Response
): Promise<void> {
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

		const newManager = await prisma.manager.create({
			data: {
				cognitoId,
				name: name.trim(),
				email: email.trim(),
				phoneNumber,
			},
		});

		console.log(`Manager id: ${cognitoId} has been created successfully.`);
		res.status(200).json({ data: newManager });
	} catch (error) {
		console.error("Error creating manager: ", error);
		res.status(500).json({ message: "Error creating manager." });
	}
}

export async function updateManager(
	req: Request,
	res: Response
): Promise<void> {
	console.log("/:cognitoId PUT called");

	try {
		const { cognitoId } = req.params;
		const { name, email, phoneNumber } = req.body;

		const manager = await prisma.manager.findUnique({ where: { cognitoId } });
		if (!manager) {
			res.status(404).json({ message: "Manager not found." });
			return;
		}

		await prisma.manager.update({
			where: { cognitoId },
			data: { name, email, phoneNumber },
		});

		console.log(`Manager id: ${cognitoId} has been updated successfully.`);
		res.status(200).json({ data: manager });
	} catch (error) {
		console.error("Error updating manager: ", error);
		res.status(500).json({ message: "Error updating manager." });
	}
}

export async function getPropertiesByManagerId(
	req: Request,
	res: Response
): Promise<void> {
	console.log("/:cognitoId GET called");

	try {
		const { cognitoId } = req.params;
		const properties = await prisma.property.findMany({
			where: { managerCognitoId: cognitoId },
			include: {
				location: true,
			},
		});

		const propertiesWithLocation = await Promise.all(
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

		res.status(200).json({ data: propertiesWithLocation });
	} catch (error) {
		console.error("Error retrieving properties: ", error);
		res.status(500).json({ message: "Error retrieving properties." });
	}
}
