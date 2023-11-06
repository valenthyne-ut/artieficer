/* eslint-disable @typescript-eslint/no-var-requires */
import { existsSync, readFileSync } from "fs";
import { dirname, join } from "path";

export type ClientCandidateConfig = {
	name: string | null;
	token: string;
};

export type ClientCandidateBootstrapper = {
	init: ((config: ClientCandidateConfig) => boolean);
}

export class ClientCandidate {

	pathTo: string;
	config: ClientCandidateConfig;
	bootstrapper: ClientCandidateBootstrapper;

	constructor(pathToCandidate: string) {
		
		if(!existsSync(pathToCandidate)) { throw new Error("Candidate's path is invalid."); }

		this.pathTo = pathToCandidate;

		// validate the config file
		
		const candidateConfigPath = join(pathToCandidate, ".cfg.json");
		if(!existsSync(candidateConfigPath)) { throw new Error("Candidate doesn't have configuration file."); }

		const candidateConfigRaw = readFileSync(candidateConfigPath, { encoding: "utf-8" });
		const candidateConfig = JSON.parse(candidateConfigRaw) as ClientCandidateConfig;

		if(!("token" in candidateConfig)) { throw new Error("Candidate has invalid configuration. No token found."); }
		if(!("name" in candidateConfig)) { (candidateConfig as ClientCandidateConfig).name == dirname(pathToCandidate); }

		this.config = candidateConfig;

		// validate the bootstrapper

		const bootstrapperPath = join(pathToCandidate, "bootstrap.js");
		if(!existsSync(bootstrapperPath)) { throw new Error("Candidate doesn't have a bootstrapper."); }
		
		const bootstrapper = require(bootstrapperPath) as ClientCandidateBootstrapper;
		if(!("init" in bootstrapper)) { throw new Error("Candidate bootstrapper doesn't have \"init\" method."); }

		this.bootstrapper = bootstrapper;

	}

}