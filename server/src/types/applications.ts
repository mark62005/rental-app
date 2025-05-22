import { Application, Manager, Tenant, Location } from "../generated/prisma";

export interface IApplicationWithLocationManagerTenant
	extends Partial<Application> {
	property: {
		location: Partial<Location>;
		manager: Partial<Manager>;
	};

	tenant: Partial<Tenant>;
}
