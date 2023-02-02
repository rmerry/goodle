// TODO Inject .env variables or make it so that this isnt hardcoded
export const API_URL =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? "http://localhost:4001"
    : "https://api-goodle.codestar.com";
