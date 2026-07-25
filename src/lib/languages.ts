export type Language = {
	locale: string;
	name: string;
	nativeName: string;
};

// English is the only catalog currently advertised by the UI. The other
// Fluent catalogs remain available under locales/ as contribution sources for
// future Weblate translations.
export const supportedLanguages: Language[] = [
	{ locale: 'en-US', name: 'English', nativeName: 'English' }
];
