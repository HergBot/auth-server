import dotenv from "dotenv";

const envConfig = dotenv.config();

export const HERGBOT_AUTH_SERVICE_ID = Buffer.from(
  envConfig.parsed?.HERGBOT_AUTH_SERVICE_ID ?? "-1",
  "hex"
);

export const HERGBOT_AUTH_SERVICE_ADMIN_ROLE_ID = Buffer.from(
  envConfig.parsed?.HERGBOT_AUTH_SERVICE_ADMIN_ROLE_ID ?? "-1",
  "hex"
);
