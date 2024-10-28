// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
        interface Locals {}
        interface Platform {}
        interface PrivateEnv {
            OPENAI_API_KEY: string;
        }
        interface PublicEnv {}
        interface PageData {}
        interface Error {}
    }

    interface ImportMetaEnv {
        readonly VITE_BUILD_INFO: {
            branchName: string;
            commitHash: string;
            buildDate: string;
        };
        readonly OPENAI_API_KEY: string;
    }

    interface ImportMeta {
        readonly env: ImportMetaEnv;
    }
    interface Genre {
        id: number;
        name: string;
    }
    interface MovieDetails {
        title: string;
        release_date: Date;
        overview: string;
        review: string;
        runtime: number;
        poster: string | null;
    }
    interface CastMember {
        id: number;
        name: string;
        character: string;
        picture: string | null;
        roles: string; // Assuming roles is a string
    }
}

export {};
