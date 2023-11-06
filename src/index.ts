import { readdirSync } from "fs";
import { join } from "path";
import { ClientCandidate } from "./classes/ClientCandidate";

(() => {

	const clisDirPath = join(__dirname, "clients");
	const clisDirContents = readdirSync(clisDirPath);

	const clients: Array<ClientCandidate> = [];

	clisDirContents.forEach(cliCandidate => {
		try {
			const cliCandidatePath = join(clisDirPath, cliCandidate);
			clients.push(new ClientCandidate(cliCandidatePath));
		} catch(error) {
			console.log(error);
		}
	});

})();