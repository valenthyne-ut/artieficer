import { readdirSync, writeFileSync } from "fs";
import { join } from "path";
import { ClientCandidate } from "./classes/ClientCandidate";
import { Logger } from "./classes/Logger";

export const logger = new Logger();

(() => {

	console.clear();
	logger.info("Artieficer v" + process.env.npm_package_version);

	const clisDirPath = join(__dirname, "clients");
	const clisDirContents = readdirSync(clisDirPath);

	const clients: Array<ClientCandidate> = [];

	clisDirContents.forEach(cliCandidate => {
		const cliCandidatePath = join(clisDirPath, cliCandidate);
		try {
			clients.push(new ClientCandidate(cliCandidatePath));
		} catch(error) {
			let errorMessage = "";
			let trace = undefined;

			if(typeof error === "string") {
				errorMessage = error;
			} else if(error instanceof Error) {
				errorMessage = error.message;
				trace = error.stack;
			}

			logger.error(`An error occurred while reading client candidate from ${cliCandidatePath}\n${errorMessage}\n\n${trace}` );
		}
	});

	if(clients.length > 0) {

		logger.info("Found", clients.length, "client(s).\n");

		clients.forEach(client => {
			try {
				logger.info(`Running "${client.config.name}";`);
				client.bootstrapper.init(client.config);
			} catch(error) {
				
				let errorMessage = "";
				let trace = undefined;

				if(typeof error === "string") {
					errorMessage = error;
				} else if(error instanceof Error) {
					errorMessage = error.message;
					trace = error.stack;
				}

				logger.error(`Execution failed for "${client.config.name}"`);
				
				const errFilename = "err-" +
					new Date().toISOString()
						.replace(/T/, "_")
						.replace(/:/g, "-")
						.replace(/\..+/, "");
				
				const errFilePath = join(client.pathTo, errFilename);

				writeFileSync(errFilePath, `${errorMessage}\n${trace}`, { encoding: "utf-8" });

			}
		});

	} else {
		logger.warning("No clients found. Stopping.");
	}
	
})();