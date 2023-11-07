export {};

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			[key: string]: string | undefined;
			npm_package_version: string | undefined;
		}
	}
}