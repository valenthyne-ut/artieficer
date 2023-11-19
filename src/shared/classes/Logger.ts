import chalk from "chalk";

export class Logger {

	info(...text: unknown[]) {
		console.log( `[${chalk.blue("#")}] `+ text.join( " " ) );
	}
	
	success(...text: unknown[]) {
		console.log( `[${chalk.green("#")}] `+ text.join( " " ) );
	}

	warning(...text: unknown[]) {
		console.log( `[${chalk.yellow("!")}] `+ text.join( " " ) );
	}

	error(...text: unknown[]) {
		console.log( `[${chalk.red("X")}] `+ text.join( " " ) );
	}

}