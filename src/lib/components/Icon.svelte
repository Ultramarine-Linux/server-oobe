<script lang="ts" module>
	const nucleo = import.meta.glob('../icons/*.svg', {
		eager: true,
		query: '?raw',
		import: 'default'
	}) as Record<string, string>;

	const stroke = (paths: string) =>
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

	/** Simple line glyphs the Nucleo set here does not have. */
	const glyphs: Record<string, string> = {
		check: stroke('<path d="m3.5 8.5 3 3 6-7"/>'),
		'chevron-right': stroke('<path d="m6 3.5 4.5 4.5L6 12.5"/>'),
		menu: stroke('<path d="M2.5 4h11M2.5 8h11M2.5 12h11"/>'),
		x: stroke('<path d="m4 4 8 8M12 4l-8 8"/>'),
		contrast: stroke(
			'<circle cx="8" cy="8" r="6"/><path d="M8 2a6 6 0 0 1 0 12Z" fill="currentColor"/>'
		)
	};

	/** SvelteKit 3 treats any `server.*` file as server-only, so these live under another name. */
	const aliases: Record<string, string> = { server: 'server-rack' };

	function source(name: string): string {
		const file = aliases[name] ?? name;
		return glyphs[name] ?? nucleo[`../icons/${file}.svg`] ?? '';
	}
</script>

<script lang="ts">
	let { name, class: className = '' }: { name: string; class?: string } = $props();
</script>

<span class="icon {className}" aria-hidden="true">{@html source(name)}</span>
