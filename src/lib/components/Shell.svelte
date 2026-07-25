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
	let stepsCard = $state<HTMLElement | null>(null);
	let stepsHeight = $state(0);

	$effect(() => {
		const storedTheme = localStorage.getItem('oobe-theme');
		theme = storedTheme === 'dark' ? 'dark' : 'light';
	});

	$effect(() => {
		document.documentElement.classList.toggle('dark', theme === 'dark');
	});

	$effect(() => {
		const card = stepsCard;
		if (!card) return;
		const updateHeight = () => (stepsHeight = card.scrollHeight);
		const observer = new ResizeObserver(updateHeight);
		observer.observe(card);
		updateHeight();
		return () => observer.disconnect();
	});

	function toggleTheme() {
		theme = theme === 'light' ? 'dark' : 'light';
		localStorage.setItem('oobe-theme', theme);
	}
</script>

<main class="shell">
	<Header {theme} onToggleTheme={toggleTheme} />
	<div class="content-grid">
		<div class="steps-column">
			<div class="steps-card-reference" bind:this={stepsCard}>
				<StepNavigation {steps} {selectedStep} {onSelect} />
			</div>
		</div>
		<section
			class="workspace"
			aria-live="polite"
			style:height={stepsHeight ? `${stepsHeight}px` : undefined}
		>
			{@render children()}
		</section>
	</div>
</main>
