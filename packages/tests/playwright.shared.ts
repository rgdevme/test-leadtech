import type { PlaywrightTestConfig, ReporterDescription } from "@playwright/test"

import { applicationUrl } from "./environment.js"

export const appWebServer: PlaywrightTestConfig["webServer"] = {
	command: "pnpm --dir ../app start",
	reuseExistingServer: false,
	timeout: 120_000,
	url: `${applicationUrl}/en`
}

export const createReporters = (suffix: string, provider = false): ReporterDescription[] => {
	const reportRoot = provider ? "playwright-report-provider" : "playwright-report"
	const resultRoot = provider ? "test-results-provider" : "test-results"

	return [
		["list"],
		["html", { open: "never", outputFolder: reportRoot }],
		["junit", { outputFile: `${resultRoot}/${suffix}.xml` }]
	]
}
