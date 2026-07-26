<script lang="ts">
	import Header from './Header.svelte';

	let {
		children
	}: {
		children: import('svelte').Snippet;
	} = $props();

	let theme = $state<'light' | 'dark'>('light');

	$effect(() => {
		const storedTheme = localStorage.getItem('oobe-theme');
		theme = storedTheme === 'dark' ? 'dark' : 'light';
	});

	$effect(() => {
		document.documentElement.classList.toggle('dark', theme === 'dark');
	});

	function toggleTheme() {
		theme = theme === 'light' ? 'dark' : 'light';
		localStorage.setItem('oobe-theme', theme);
	}
</script>

<main class="shell">
	<Header {theme} onToggleTheme={toggleTheme} />
	<div class="content-grid">
		<section class="workspace" aria-live="polite">
			{@render children()}
		</section>
	</div>
</main>
