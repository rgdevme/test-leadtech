import { defineConfig } from "@playwright/test"

import { applicationUrl } from "./environment.js"
import { appWebServer, createReporters } from "./playwright.shared.js"

export default defineConfig({
	fullyParallel: false,
	outputDir: "test-results-provider/artifacts",
	reporter: createReporters("playwright-provider", true),
	retries: 0,
	testDir: "./test",
	testMatch: /test[\\/]billing[\\/].*\.test\.ts$/,
	use: {
		baseURL: applicationUrl,
		extraHTTPHeaders: { "x-forwarded-for": "198.51.100.20" },
		trace: "retain-on-failure"
	},
	webServer: appWebServer,
	workers: 1
})
