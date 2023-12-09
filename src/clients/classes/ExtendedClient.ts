/* eslint-disable @typescript-eslint/no-var-requires */
import { ClientCommand } from "cli-lib/ClientCommand";
import { Client, ClientOptions, RESTPostAPIApplicationCommandsJSONBody as CommandsData, Routes } from "discord.js";
import { existsSync, readdirSync } from "fs";
import { join } from "path";
import { ClientInstanceConfig } from "shared-lib/types/ClientInstanceConfig";
import { logger } from "shared-lib/classes/Logger";

export class ExtendedClient extends Client {
	private commandsMap: Map<string, ClientCommand> = new Map();
	private commandsFolderPath: string;
	private config: ClientInstanceConfig;

	constructor(options: ClientOptions, config: ClientInstanceConfig, commandsFolderPath: string) {
		super(options);

		if(!existsSync(commandsFolderPath)) {
			throw new Error("Interactions folder path doesn't exist.");
		} else {
			this.commandsFolderPath = commandsFolderPath;
		}

		this.config = config;
		this.loadCommands();
	}

	private loadCommands() {
		const commandFilenames = readdirSync(this.commandsFolderPath);
		commandFilenames.forEach(filename => {
			const filepath = join(this.commandsFolderPath, filename);
			const command = require(filepath) as ClientCommand;

			if(!("data" in command && "execute" in command)) {
				logger.warning("Invalid command at", filepath);
			} else {
				const commandName = command.data.name;
				this.commandsMap.set(commandName, command);
			}
		});
	}

	deployCommands() {
		if(!this.isReady()) {
			throw new Error("Cannot deploy commands when client isn't logged in.");
		}
		
		logger.info("Deploying commands.");

		const commandsData: Array<CommandsData> = this.getCommands().map(command => command.data.toJSON());
		
		const user = this.user;
		const guilds = this.guilds.cache.map(guild => guild.id);
		guilds.forEach(async (guildId: string) => {
			try {
				await this.rest.put(Routes.applicationGuildCommands(user.id, guildId), {body: commandsData});
				logger.success(`Deployed ${commandsData.length} commands to guild "${(await this.guilds.fetch(guildId)).name}"`);
			} catch(error) {
				let errorMessage = "";

				if(typeof error === "string") {
					errorMessage = error;
				} else if(error instanceof Error) {
					errorMessage = error.stack || error.message;
				}

				logger.error(`Failed to deploy interactions to guild "${((await this.guilds.fetch(guildId)).name)}".\n${errorMessage}`);
			}
		});
	}

	getCommands(): Array<ClientCommand> {
		return Array.from(this.commandsMap.values());
	}

	getCommand(name: string): ClientCommand | undefined {
		return this.commandsMap.get(name);
	}

	getShouldDeployCommands(): boolean {
		return this.config.deployCommands;
	}
}