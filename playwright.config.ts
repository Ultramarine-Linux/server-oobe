import { defineConfig, devices } from '@playwright/test';

const isCI = Boolean(process.env.CI);

export default defineConfig({
	forbidOnly: isCI,
	fullyParallel: true,
	testDir: './tests',
	testMatch: /.*\.test\.ts/,
	reporter: 'list',
	projects: [
		{
			name: 'Chromium',
			use: {
				...devices['Desktop Chrome'],
				headless: true
			}
		},
		{
			name: 'Mobile Chrome',
			use: {
				...devices['Pixel 5'],
				headless: true
			}
		}
	],
	webServer: {
		command:
			'OOBE_FIXTURE_MODE=true VITE_FIXTURE_API=true pnpm exec vite dev --host 127.0.0.1 --port 4173',
		reuseExistingServer: !process.env.CI,
		timeout: 120_000,
		url: 'http://127.0.0.1:4173/'
	}
});
