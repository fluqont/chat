declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "test" | "production";
      PORT: string;
      WS_PORT: string;
      DATABASE_URL: string;
      TEST_DATABASE_URL: string;
      SUPABASE_ANON_KEY: string;
      SUPABASE_PROJECT_URL: string;
      CLIENT_URL: string;
      SECRET: string;
    }
  }
}

export {};
