import { readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export type OobePage = {
	label: string;
	path: string;
};

const routesDirectory = fileURLToPath(new URL('../src/routes', import.meta.url));

function routePath(directory: string): string {
	const relativeDirectory = relative(routesDirectory, directory);
	if (!relativeDirectory) return '/';

	const segments = relativeDirectory
		.split(sep)
		.filter((segment) => segment && !segment.startsWith('(') && !segment.startsWith('['));
	return `/${segments.join('/')}`;
}

function routeLabel(path: string): string {
	return path === '/' ? 'welcome' : path.slice(1).replaceAll('/', ' / ');
}

function discover(directory: string): OobePage[] {
	const pages: OobePage[] = [];
	for (const entry of readdirSync(directory, { withFileTypes: true })) {
		const entryPath = join(directory, entry.name);
		if (entry.isDirectory()) pages.push(...discover(entryPath));
		if (entry.isFile() && entry.name === '+page.svelte') {
			const path = routePath(directory);
			// OOBE pages are intentionally static. Dynamic parameter routes need
			// explicit fixture URLs and should not silently enter this audit.
			if (!relativeDirectoryContainsDynamicSegment(directory)) {
				pages.push({ label: routeLabel(path), path });
			}
		}
	}
	return pages;
}

function relativeDirectoryContainsDynamicSegment(directory: string): boolean {
	const relativeDirectory = relative(routesDirectory, directory);
	return relativeDirectory.split(sep).some((segment) => segment.startsWith('['));
}

export const oobePages = discover(routesDirectory).sort((left, right) =>
	left.path.localeCompare(right.path)
);

if (oobePages.length === 0) {
	throw new Error('No static OOBE pages were discovered under src/routes.');
}

// Avoid silently auditing the same URL twice when route groups are introduced.
const duplicatePaths = oobePages.filter(
	(page, index) => oobePages.findIndex((candidate) => candidate.path === page.path) !== index
);
if (duplicatePaths.length > 0) {
	throw new Error(
		`Duplicate OOBE page paths: ${duplicatePaths.map((page) => page.path).join(', ')}`
	);
}

// statSync is intentionally retained in this module's imports as a cheap check
// that the route root is a directory when the repository is used from CI.
if (!statSync(routesDirectory).isDirectory()) {
	throw new Error(`OOBE routes directory is not a directory: ${routesDirectory}`);
}
