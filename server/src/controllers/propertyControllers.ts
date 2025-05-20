import { Request, Response } from "express";
import { Prisma, PrismaClient, Location } from "../generated/prisma";
import { wktToGeoJSON } from "@terraformer/wkt";
import { Upload } from "@aws-sdk/lib-storage";
import { S3Client } from "@aws-sdk/client-s3";
import axios from "axios";

const prisma = new PrismaClient();
const s3Client = new S3Client({
	region: process.env.AWS_REGION,
});

export async function getFilteredProperties(
	req: Request,
	res: Response
): Promise<void> {
	console.log("/ GET called");

	try {
		const {
			favoriteIds,
			priceMin,
			priceMax,
			beds,
			baths,
			propertyType,
			squareFeetMin,
			squareFeetMax,
			amenities,
			availableFrom,
			latitude,
			longitude,
		} = req.query;

		let whereConditions: Prisma.Sql[] = [];

		if (favoriteIds) {
			const favoriteIdsArray = (favoriteIds as string).split(",").map(Number);
			whereConditions.push(
				Prisma.sql`p.id IN (${Prisma.join(favoriteIdsArray)})`
			);
		}

		if (priceMin) {
			whereConditions.push(
				Prisma.sql`p."pricePerMonth" >= ${Number(priceMin)}`
			);
		}

		if (priceMax) {
			whereConditions.push(
				Prisma.sql`p."pricePerMonth" <= ${Number(priceMax)}`
			);
		}

		if (beds && beds !== "any") {
			whereConditions.push(Prisma.sql`p.beds >= ${Number(beds)}`);
		}

		if (baths && baths !== "any") {
			whereConditions.push(Prisma.sql`p.baths >= ${Number(baths)}`);
		}

		if (squareFeetMin) {
			whereConditions.push(
				Prisma.sql`p."squareFeet" >= ${Number(squareFeetMin)}`
			);
		}

		if (squareFeetMax) {
			whereConditions.push(
				Prisma.sql`p."squareFeet" <= ${Number(squareFeetMax)}`
			);
		}

		if (propertyType && propertyType !== "any") {
			whereConditions.push(
				Prisma.sql`p."propertyType" = ${propertyType}::"PropertyType"`
			);
		}

		if (amenities && amenities !== "any") {
			const amenitiesArray = (amenities as string).split(",");
			whereConditions.push(Prisma.sql`p.amenities @> ${amenitiesArray}`);
		}

		if (availableFrom && availableFrom !== "any") {
			const availableFromDate =
				typeof availableFrom === "string" ? availableFrom : null;
			if (availableFromDate) {
				const date = new Date(availableFromDate);
				if (!isNaN(date.getTime())) {
					whereConditions.push(
						Prisma.sql`EXISTS (
              SELECT 1 FROM "Lease" l 
              WHERE l."propertyId" = p.id 
              AND l."startDate" <= ${date.toISOString()}
            )`
					);
				}
			}
		}

		if (latitude && longitude) {
			const lat = parseFloat(latitude as string);
			const lng = parseFloat(longitude as string);
			const radiusInKilometers = 1000;
			const degrees = radiusInKilometers / 111; // Converts kilometers to degrees

			whereConditions.push(
				Prisma.sql`ST_DWithin(
          l.coordinates::geometry,
          ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326),
          ${degrees}
        )`
			);
		}

		const completeQuery = Prisma.sql`
      SELECT 
        p.*,
        json_build_object(
          'id', loc.id,
          'address', loc.address,
          'city', loc.city,
          'state', loc.state,
          'country', loc.country,
          'postalCode', loc."postalCode",
          'coordinates', json_build_object(
            'longitude', ST_X(loc."coordinates"::geometry),
            'latitude', ST_Y(loc."coordinates"::geometry)
          )
        ) as location
      FROM "Property" p
      JOIN "Location" loc ON p."locationId" = loc.id
      ${
				whereConditions.length > 0
					? Prisma.sql`WHERE ${Prisma.join(whereConditions, " AND ")}`
					: Prisma.empty
			}
    `;

		const properties: Object[] = await prisma.$queryRaw(completeQuery);

		console.log(`Successfully retrieved ${properties.length} properties.`);
		res.status(200).json({ data: properties });
	} catch (error) {
		console.error("Error retrieving properties: ", error);
		res.status(500).json({ message: "Error retrieving properties." });
	}
}

export async function getPropertyWithId(
	req: Request,
	res: Response
): Promise<void> {
	console.log("/:id GET called");

	try {
		const { id } = req.params;

		const property = await prisma.property.findUnique({
			where: { id: Number(id) },
			include: {
				location: true,
			},
		});

		if (!property) {
			res.status(404).json({ message: "Property not found." });
			return;
		}

		const coordinates: { coordinates: string }[] =
			await prisma.$queryRaw`SELECT ST_asText(coordinates) as coordinates from "Location" where id = ${property.location.id}`;

		const geoJSON: any = wktToGeoJSON(coordinates[0]?.coordinates || "");
		const longitude = geoJSON.coordinates[0];
		const latitude = geoJSON.coordinates[1];

		const propertyWithCoordinates = {
			...property,
			loaction: {
				...property.location,
				coordinates: {
					longitude,
					latitude,
				},
			},
		};

		console.log(`Retrieved property id: ${id} successfully.`);
		res.status(200).json({ data: propertyWithCoordinates });
	} catch (error) {
		console.error("Error retrieving property: ", error);
		res.status(500).json({ message: "Error retrieving property." });
	}
}

export async function createProperty(
	req: Request,
	res: Response
): Promise<void> {
	console.log("/ POST called");

	try {
		const files = req.files as Express.Multer.File[];
		const {
			address,
			city,
			state,
			country,
			postalCode,
			managerCognitoId,
			...propertyData
		} = req.body;

		const photoUrls = await Promise.all(
			files.map(async (file) => {
				const uploadParams = {
					Bucket: process.env.S3_BUCKET_NAME!,
					Key: `properties/${Date.now()}-${file.originalname}`,
					Body: file.buffer,
					ContentType: file.mimetype,
				};

				const uploadResult = await new Upload({
					client: s3Client,
					params: uploadParams,
				}).done();

				return uploadResult.Location;
			})
		);

		const geocodingUrl = `
			https://nominatim.openstreetmap.org/search?${new URLSearchParams({
				street: address,
				city,
				country,
				postalcode: postalCode,
				format: "json",
				limit: "1",
			}).toString()}
		`;

		const geocodingResponse = await axios.get(geocodingUrl, {
			headers: {
				"User-Agent": "RealEstateApp (justsomedummyemail@gmail.com",
			},
		});

		const [longitude, latitude] =
			geocodingResponse.data[0]?.lon && geocodingResponse.data[0]?.lat
				? [
						parseFloat(geocodingResponse.data[0]?.lon),
						parseFloat(geocodingResponse.data[0]?.lat),
					]
				: [0, 0];

		// create location
		const [location] = await prisma.$queryRaw<Location[]>`
      INSERT INTO "Location" (address, city, state, country, "postalCode", coordinates)
      VALUES (${address}, ${city}, ${state}, ${country}, ${postalCode}, ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326))
      RETURNING id, address, city, state, country, "postalCode", ST_AsText(coordinates) as coordinates;
    `;

		const amenities =
			typeof propertyData.amenities === "string"
				? propertyData.amenities.split(",")
				: [];
		const highlights =
			typeof propertyData.highlights === "string"
				? propertyData.highlights.split(",")
				: [];

		// Create property
		const newProperty = await prisma.property.create({
			data: {
				...propertyData,
				photoUrls,
				locationId: location.id,
				managerCognitoId,
				amenities,
				highlights,
				isPetsAllowed: propertyData.isPetsAllowed === "true",
				isParkingIncluded: propertyData.isParkingIncluded === "true",
				pricePerMonth: parseFloat(propertyData.pricePerMonth),
				securityDeposit: parseFloat(propertyData.securityDeposit),
				applicationFee: parseFloat(propertyData.applicationFee),
				beds: parseInt(propertyData.beds),
				baths: parseFloat(propertyData.baths),
				squareFeet: parseInt(propertyData.squareFeet),
			},
			include: {
				location: true,
				manager: true,
			},
		});

		console.log(`Created property id: ${newProperty.id} successfully.`);
		res.status(201).json({ data: newProperty });
	} catch (error) {
		console.error("Error creating property: ", error);
		res.status(500).json({ message: "Error creating property." });
	}
}
