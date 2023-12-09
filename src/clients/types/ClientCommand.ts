import { CommandInteraction, ContextMenuCommandBuilder, SlashCommandBuilder } from "discord.js";

export type ClientCommand = {
	data: SlashCommandBuilder | ContextMenuCommandBuilder;
	execute(interaction: CommandInteraction): Promise<void>;
}