import { PrismaClient } from "../../generated/prisma";
import { IApplicationWithLocationManagerTenant } from "../../types/applications";

export function calculateNextPaymentDate(startDate: Date): Date {
	const today = new Date();
	const nextPaymentDate = new Date(startDate);

	while (nextPaymentDate <= today) {
		nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
	}
	return nextPaymentDate;
}

export async function formatApplications(
	applications: IApplicationWithLocationManagerTenant[],
	prisma: PrismaClient
) {
	return await Promise.all(
		applications.map(
			async (application: IApplicationWithLocationManagerTenant) => {
				const lease = await prisma.lease.findFirst({
					where: {
						tenant: {
							cognitoId: application.tenantCognitoId,
						},
						propertyId: application.propertyId,
					},
					orderBy: { startDate: "desc" },
				});

				return {
					...application,
					property: {
						...application.property,
						address: application.property.location.address,
					},
					manager: application.property.manager,
					lease: lease
						? {
								...lease,
								nextPaymentDate: calculateNextPaymentDate(lease.startDate),
							}
						: null,
				};
			}
		)
	);
}
