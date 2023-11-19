import { ClientInstanceConfig } from "shared-lib/types/ClientInstanceConfig";

export type ClientInstanceBootstrapper = {
	init: (config: ClientInstanceConfig) => unknown;
}