/// <reference types="vite/client" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	interface ImportMetaEnv {
		readonly VITE_BUILD_INFO: {
			branchName: string;
			commitHash: string;
			buildDate: string;
		};
	}

	interface ImportMeta {
		readonly env: ImportMetaEnv;
	}
}

export {}