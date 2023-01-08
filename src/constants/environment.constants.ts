import dotenv from "dotenv";

const envConfig = dotenv.config();

export const HERGBOT_AUTH_SERVICE_ID =
  envConfig.parsed?.HERGBOT_AUTH_SERVICE_ID ?? "-1";

export const HERGBOT_AUTH_SERVICE_ADMIN_ROLE_ID =
  envConfig.parsed?.HERGBOT_AUTH_SERVICE_ADMIN_ROLE_ID ?? "-1";
