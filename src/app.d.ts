/// <reference types="@sveltejs/kit" />
/// <reference types="vite/client" />

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
}
export {};
