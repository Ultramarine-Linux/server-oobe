<script lang="ts">
	import type { OobeStep, StepId } from '$lib/oobe-state';
	import Header from './Header.svelte';
	import StepNavigation from './StepNavigation.svelte';

	let {
		steps,
		selectedStep,
		onSelect,
		children
	}: {
		steps: OobeStep[];
		selectedStep: StepId;
		onSelect: (id: StepId) => void;
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
		<StepNavigation {steps} {selectedStep} {onSelect} />
		<section class="workspace" aria-live="polite">{@render children()}</section>
	</div>
</main>
