import { expect, localURL, test } from './accessibility';
import { oobePages } from './oobe-pages';

for (const page of oobePages) {
	test(`Ultramarine OOBE page: ${page.label}`, async ({ page: browserPage, makeAxeBuilder }) => {
		await browserPage.goto(`${localURL}${page.path}`);
		const results = await makeAxeBuilder().analyze();
		expect(results.violations).toEqual([]);
	});
}
