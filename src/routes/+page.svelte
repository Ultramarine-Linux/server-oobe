<script lang="ts">
	import moonIcon from '$lib/icons/moon.svg';
	import sunIcon from '$lib/icons/sun.svg';
	import { fixtureSteps, type StepId } from '$lib/oobe-state';

	let selectedStep = $state<StepId>('internet');
	let detecting = $state(false);
	let tetraStatus = $state<'idle' | 'found' | 'missing'>('idle');
	let theme = $state<'light' | 'dark'>('light');

	$effect(() => {
		const storedTheme = localStorage.getItem('oobe-theme');
		theme = storedTheme === 'dark' ? 'dark' : 'light';
	});

	$effect(() => {
		document.documentElement.classList.toggle('dark', theme === 'dark');
	});

	const currentStep = $derived(fixtureSteps.find((step) => step.id === selectedStep));

	function toggleTheme() {
		theme = theme === 'light' ? 'dark' : 'light';
		localStorage.setItem('oobe-theme', theme);
	}

	async function detectTetra() {
		detecting = true;
		tetraStatus = 'idle';
		await new Promise((resolve) => setTimeout(resolve, 600));
		detecting = false;
		tetraStatus = 'missing';
	}
</script>

<svelte:head>
	<title>Server setup / Ultramarine Server</title>
	<meta name="description" content="Local first-run setup for an Ultramarine Server host." />
</svelte:head>

<main class="shell">
	<header class="topbar">
		<img class="brand-logo" src="/ultramarine-logo.svg" alt="" />
		<div class="brand-copy">
			<p class="eyebrow">Ultramarine Server</p>
			<h1>Server setup</h1>
		</div>
		<span class="local-badge">Local setup</span>
		<button
			class="theme-toggle"
			type="button"
			onclick={toggleTheme}
			aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
			title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
		>
			<img src={theme === 'light' ? moonIcon : sunIcon} alt="" aria-hidden="true" />
		</button>
	</header>

	<div class="content-grid">
		<nav class="steps-card" aria-label="Setup steps">
			<div class="card-heading">
				<p class="eyebrow">First run</p>
				<h2>Get your server ready</h2>
			</div>
			<div class="step-list">
				{#each fixtureSteps as step, index}
					<button
						class:active={selectedStep === step.id}
						class="step"
						type="button"
						onclick={() => (selectedStep = step.id)}
					>
						<span class:complete={step.status === 'complete'} class="step-number">
							{step.status === 'complete' ? '✓' : index + 1}
						</span>
						<span class="step-copy">
							<strong>{step.label}</strong>
							<small>{step.description}</small>
						</span>
					</button>
				{/each}
			</div>
		</nav>

		<section class="workspace" aria-live="polite">
			<div class="workspace-heading">
				<div>
					<p class="eyebrow">Step in progress</p>
					<h2>{currentStep?.label ?? 'Setup'}</h2>
				</div>
				<span class="status-pill">Fixture mode</span>
			</div>

			{#if selectedStep === 'internet'}
				<div class="panel success-panel">
					<div class="status-icon">✓</div>
					<div>
						<h3>Network is ready to check</h3>
						<p>
							The real OOBE backend will report connectivity, hostname, and time synchronization
							here.
						</p>
					</div>
				</div>
				<div class="panel">
					<div class="panel-title">
						<h3>Local environment</h3>
						<span class="status-pill">Tetra</span>
					</div>
					<p>Detect Tetra on this server before connecting it to the global dashboard.</p>
					{#if tetraStatus === 'missing'}
						<div class="error-panel">
							No local Tetra endpoint was found. Start Tetra and try again.
						</div>
					{/if}
					<button class="primary-button" type="button" onclick={detectTetra} disabled={detecting}>
						{detecting
							? 'Detecting…'
							: tetraStatus === 'found'
								? 'Local Tetra found'
								: 'Detect local Tetra'}
					</button>
				</div>
			{:else}
				<div class="panel empty-panel">
					<div class="status-icon">{selectedStep === 'welcome' ? '✓' : '→'}</div>
					<div>
						<h3>{currentStep?.label}</h3>
						<p>
							This fixture screen establishes the visual state for the standalone OOBE application.
						</p>
					</div>
				</div>
			{/if}

			<div class="actions">
				<button class="secondary-button" type="button">Save and continue later</button>
				<button class="primary-button" type="button">Continue</button>
			</div>
		</section>
	</div>
</main>
