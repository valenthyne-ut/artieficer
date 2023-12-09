/* eslint-disable @typescript-eslint/no-var-requires */
import { ClientInstanceBootstrapper } from "artieficer-lib/ClientInstanceBootstrapper";
import { existsSync, readFileSync } from "fs";
import { basename, join } from "path";
import { ClientInstanceConfig } from "shared-lib/types/ClientInstanceConfig";

export class ClientInstance {

	path: string;
	config: ClientInstanceConfig;
	bootstrapper: (config: ClientInstanceConfig) => unknown;

	constructor(pathToInstance: string) {

		// validate path

		if(!existsSync(pathToInstance)) { throw new Error("Instance's path is invalid."); }
		this.path = pathToInstance;

		// validate config file

		const instanceConfigPath = join(pathToInstance, ".cfg.json");
		
		if(!existsSync(instanceConfigPath)) { throw new Error("Instance doesn't have a configuration file."); }

		const instanceConfigRaw = readFileSync(instanceConfigPath, { encoding: "utf-8" });
		const instanceConfig = JSON.parse(instanceConfigRaw) as ClientInstanceConfig;

		if(!("enabled" in instanceConfig)) { throw new Error("Instance configuration has no \"enabled\" boolean property."); }
		if(!("token" in instanceConfig)) { throw new Error("Instance configuration has no \"token\" string property."); }
		if(!("deployCommands" in instanceConfig)) { throw new Error("Instance configuration has no \"deployCommands\" boolean property."); }
		if(!("name" in instanceConfig)) { (instanceConfig as ClientInstanceConfig).name = basename(this.path); }

		this.config = instanceConfig;

		// validate bootstrapper

		const bootstrapperPath = join(this.path, "bootstrap.js");

		if(!existsSync(bootstrapperPath)) { throw new Error("Instance doesn't have a bootstrapper."); }
		
		const bootstrapper = require(bootstrapperPath) as ClientInstanceBootstrapper;
		if(!("init" in bootstrapper)) { throw new Error("Instance bootstrapper doesn't have \"init\" method."); }

		this.bootstrapper = bootstrapper.init;
	
	}

}