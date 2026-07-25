import { expect, localURL, test } from './accessibility';

const stepIds = [
	'language',
	'welcome',
	'keyboard',
	'devicename',
	'whoareyou',
	'password',
	'internet',
	'tweaks',
	'tetra',
	'fyra-dash',
	'complete'
] as const;

for (const theme of ['light', 'dark'] as const) {
	test(`Ultramarine ${theme} OOBE steps`, async ({ page: browserPage, makeAxeBuilder }) => {
		await browserPage.addInitScript((selectedTheme) => {
			localStorage.setItem('oobe-theme', selectedTheme);
			document.documentElement.classList.toggle('dark', selectedTheme === 'dark');
		}, theme);
		await browserPage.goto(localURL);

		for (const stepId of stepIds) {
			await browserPage.locator(`[data-step-id="${stepId}"]`).click();
			await expect(browserPage.locator('.workspace h2')).toBeVisible();
			const results = await makeAxeBuilder().analyze();
			expect(results.violations, `Accessibility violations on ${stepId}`).toEqual([]);
		}
	});
}
