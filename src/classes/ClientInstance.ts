/* eslint-disable @typescript-eslint/no-var-requires */
import { existsSync, readFileSync } from "fs";
import { basename, join } from "path";

export type ClientInstanceConfig = {
	enabled: boolean;
	name: string | null;
	token: string;
};

export type ClientInstanceBootstrapper = {
	init: ((config: ClientInstanceConfig) => unknown);
}

export class ClientInstance {

	path: string;
	config: ClientInstanceConfig;
	bootstrapper: (config: ClientInstanceConfig) => unknown;

	constructor(pathToInstance: string) {
		
		if(!existsSync(pathToInstance)) { throw new Error("Instance's path is invalid."); }

		this.path = pathToInstance;

		// validate the config file
		
		const instanceConfigPath = join(pathToInstance, ".cfg.json");
		if(!existsSync(instanceConfigPath)) { throw new Error("Instance doesn't have configuration file."); }

		const instanceConfigRaw = readFileSync(instanceConfigPath, { encoding: "utf-8" });
		const instanceConfig = JSON.parse(instanceConfigRaw) as ClientInstanceConfig;

		if(!("enabled" in instanceConfig)) { throw new Error("Instance has invalid configuration. No \"enabled\" boolean property found."); }
		if(!("token" in instanceConfig)) { throw new Error("Instance has invalid configuration. No \"token\" string property found."); }
		if(!("name" in instanceConfig)) { (instanceConfig as ClientInstanceConfig).name = basename(pathToInstance); }

		this.config = instanceConfig;

		// validate the bootstrapper

		const bootstrapperPath = join(pathToInstance, "bootstrap.js");
		if(!existsSync(bootstrapperPath)) { throw new Error("Instance doesn't have a bootstrapper."); }
		
		const bootstrapper = require(bootstrapperPath) as ClientInstanceBootstrapper;
		if(!("init" in bootstrapper)) { throw new Error("Instance bootstrapper doesn't have \"init\" method."); }

		this.bootstrapper = bootstrapper.init;

	}

}