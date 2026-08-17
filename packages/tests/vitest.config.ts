import { defineConfig } from "vitest/config"

import "./environment.js"

export default defineConfig({
	test: {
		environment: "node",
		fileParallelism: false,
		hookTimeout: 30_000,
		include: ["test/{firestore-rules,webhooks}/**/*.test.ts"],
		reporters: ["default", ["junit", { outputFile: "test-results/vitest.xml" }]],
		sequence: {
			concurrent: false
		},
		testTimeout: 30_000
	}
})
