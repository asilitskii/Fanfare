import { defineConfig, devices } from "@playwright/test";
import { config } from "dotenv";

config();

export default defineConfig({
  use: {
    baseURL: process.env.URL,
    ignoreHTTPSErrors: true,
    trace: "retain-on-failure",
  },
  workers: 1,
  testMatch: 'test.list_store_service.ts',
  retries: 0,
  reporter: [["list"], ["html"]],
});