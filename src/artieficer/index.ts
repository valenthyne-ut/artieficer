import { readdirSync, statSync, writeFileSync } from "fs";
import { join } from "path";
import { ClientInstance } from "artieficer-lib/ClientInstance";
import { logger } from "shared-lib/classes/Logger";

(() => {

	console.clear();
	logger.info("Artieficer v" + process.env.npm_package_version);

	const clisDirPath = join(process.cwd(), "dist/clients/root");
	const clisDirContents = readdirSync(clisDirPath);
	
	const clients: Array<ClientInstance> = [];

	clisDirContents.forEach(instanceDirName => {

		const instancePath = join(clisDirPath, instanceDirName);
		if(!statSync(instancePath).isDirectory()) { return; }

		try { clients.push(new ClientInstance(instancePath)); }
		catch(error) {
			
			let errorMessage = "";
			let stackTrace = undefined;

			if(typeof error === "string") {
				errorMessage = error;
			} else if(error instanceof Error) {
				errorMessage = error.message;
				stackTrace = error.stack;
			}

			const errFilename = "err-" +
				new Date().toISOString()
					.replace(/T/, "_")
					.replace(/:/g, "-")
					.replace(/\..+/, "");
		
			const errFilePath = join(instancePath, errFilename);
			
			logger.error(`An error occurred while reading a client instance from ${instancePath}.\n${errorMessage}\n\nStack trace ${errFilePath}`);

			writeFileSync(errFilePath, `${errorMessage}\n${stackTrace}`, { encoding: "utf-8" });

		}

	});

	if(clients.length > 0) {

		logger.info("Found", clients.length, "client(s).\n");

		clients.forEach(client => {

			try {
				if(client.config.enabled) {
					logger.success(`Running client "${client.config.name}"...`);
					client.bootstrapper(client.config);
				} else {
					logger.warning(`Client "${client.config.name}" is disabled.`);
				}
			} catch(error) {

				let errorMessage = "";
				let stackTrace = undefined;

				if(typeof error === "string") {
					errorMessage = error;
				} else if(error instanceof Error) {
					errorMessage = error.message;
					stackTrace = error.stack;
				}
				
				const errFilename = "err-" +
					new Date().toISOString()
						.replace(/T/, "_")
						.replace(/:/g, "-")
						.replace(/\..+/, "");
				
				const errFilePath = join(client.path, errFilename);

				logger.error(`Execution failed for "${client.config.name}". Stack trace ${errFilePath}"`);

				writeFileSync(errFilePath, `${errorMessage}\n${stackTrace}`, { encoding: "utf-8" });

			}

		});

	} else {
		logger.warning("No clients found. Stopping.");
	}

})();