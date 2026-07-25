<script lang="ts">
	import { fixtureSteps, type StepId } from '$lib/oobe-state';

	let selectedStep = $state<StepId>('internet');
	let detecting = $state(false);
	let tetraStatus = $state<'idle' | 'found' | 'missing'>('idle');

	const currentStep = $derived(fixtureSteps.find((step) => step.id === selectedStep));

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
					<div class="status-icon">
						{selectedStep === 'welcome' ? '✓' : '→'}
					</div>
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

<style>
	.shell {
		min-height: 100vh;
		padding: 2rem;
		max-width: 1180px;
		margin: 0 auto;
	}
	.topbar {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 2.5rem;
	}
	.brand-logo {
		width: 2.25rem;
		height: 2.25rem;
		object-fit: contain;
	}

	.eyebrow {
		margin: 0 0 0.3rem;
		color: var(--muted-foreground);
		font-size: 0.7rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
	h1,
	h2,
	h3,
	p {
		margin-top: 0;
	}
	h1 {
		margin-bottom: 0;
		font-size: 1rem;
	}
	h2 {
		margin-bottom: 0;
		font-size: 1.25rem;
	}
	h3 {
		margin-bottom: 0.4rem;
		font-size: 0.95rem;
	}
	.brand-copy {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 0.15rem;
	}
	.brand-copy .eyebrow,
	.brand-copy h1 {
		line-height: 1.2;
	}
	.local-badge,
	.status-pill {
		margin-left: auto;
		border: 1px solid var(--border);
		color: var(--muted-foreground);
		padding: 0.3rem 0.55rem;
		font-size: 0.7rem;
	}
	.content-grid {
		display: grid;
		grid-template-columns: minmax(230px, 0.7fr) minmax(0, 1.5fr);
		gap: 1.25rem;
	}
	.steps-card,
	.workspace,
	.panel {
		border: 1px solid var(--border);
		background: var(--card);
	}
	.steps-card {
		padding: 1.25rem;
	}
	.card-heading,
	.workspace-heading {
		padding-bottom: 1rem;
		border-bottom: 1px solid var(--border);
	}
	.step-list {
		display: grid;
		gap: 0.35rem;
		margin-top: 1rem;
	}
	.step {
		display: flex;
		gap: 0.7rem;
		width: 100%;
		padding: 0.7rem;
		border: 1px solid transparent;
		background: transparent;
		color: var(--muted-foreground);
		text-align: left;
	}
	.step:hover,
	.step.active {
		border-color: var(--ring);
		background: var(--muted);
		color: var(--foreground);
	}
	.step-number {
		display: grid;
		place-items: center;
		width: 1.5rem;
		height: 1.5rem;
		border: 1px solid var(--ring);
		font-size: 0.75rem;
	}
	.step-number.complete {
		border-color: #86efac;
		color: #86efac;
	}
	.step-copy {
		display: grid;
		gap: 0.2rem;
	}
	.step-copy strong {
		font-size: 0.8rem;
	}
	.step-copy small {
		color: var(--gray-700);
		font-size: 0.7rem;
	}
	.workspace {
		padding: 1.5rem;
	}
	.workspace-heading {
		display: flex;
		align-items: start;
		margin-bottom: 1rem;
	}
	.workspace-heading .status-pill {
		margin-top: 0.15rem;
	}
	.panel {
		display: flex;
		gap: 1rem;
		padding: 1.25rem;
		margin-bottom: 1rem;
	}
	.panel p {
		color: var(--muted-foreground);
		font-size: 0.85rem;
		line-height: 1.5;
	}
	.success-panel {
		border-color: color-mix(in srgb, var(--primary) 45%, var(--border));
	}
	.status-icon {
		flex: 0 0 auto;
		display: grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
		color: var(--primary);
		border: 1px solid currentColor;
	}
	.panel-title {
		display: flex;
		justify-content: space-between;
		width: 100%;
	}
	.panel-title .status-pill {
		margin: 0;
	}
	.panel-title + p {
		margin-top: 0.5rem;
	}
	.error-panel {
		margin: 0.75rem 0;
		border: 1px solid var(--primary);
		background: color-mix(in srgb, var(--primary) 15%, var(--background));
		color: var(--foreground);
		padding: 0.7rem;
		font-size: 0.8rem;
	}
	.primary-button,
	.secondary-button {
		border: 1px solid var(--ring);
		padding: 0.55rem 0.8rem;
		font-size: 0.8rem;
	}
	.primary-button {
		background: var(--primary);
		color: var(--primary-foreground);
	}
	.secondary-button {
		background: transparent;
		color: var(--foreground);
	}
	.actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.6rem;
	}
	@media (max-width: 700px) {
		.shell {
			padding: 1rem;
		}
		.content-grid {
			grid-template-columns: 1fr;
		}
		.actions {
			flex-direction: column-reverse;
		}
		.actions button {
			width: 100%;
		}
	}
</style>
