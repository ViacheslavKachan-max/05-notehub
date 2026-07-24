/// <reference types="vite/client" />

declare module "modern-normalize";

interface ImportMetaEnv {
  readonly VITE_NOTEHUB_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
