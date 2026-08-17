import { defineConfig, devices } from "@playwright/test"

import { applicationUrl } from "./environment.js"
import { appWebServer, createReporters } from "./playwright.shared.js"

export default defineConfig({
	fullyParallel: false,
	outputDir: "test-results/artifacts",
	projects: [
		{
			name: "chromium",
			testMatch: /test[\\/](?:auth|documents)[\\/].*\.test\.ts$/,
			use: { ...devices["Desktop Chrome"] }
		}
	],
	reporter: createReporters("playwright"),
	retries: 1,
	testDir: "./test",
	use: {
		baseURL: applicationUrl,
		extraHTTPHeaders: { "x-forwarded-for": "198.51.100.10" },
		trace: "retain-on-failure"
	},
	webServer: appWebServer,
	workers: 1
})
