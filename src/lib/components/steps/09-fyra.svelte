<script lang="ts">
	import StepLayout from '$lib/components/StepLayout.svelte';
	import type { HostingChoice } from '$lib/oobe-state';
	let {
		hostingChoice = $bindable<HostingChoice | null>(null),
		onBack,
		onContinue
	}: {
		hostingChoice?: HostingChoice | null;
		onBack: () => void;
		onContinue: () => void;
	} = $props();

	const options: { value: HostingChoice; title: string; description: string }[] = [
		{
			value: 'global',
			title: 'Global hosting',
			description:
				'Manage this server through the Fyra global dashboard. Requires a Cloudflare tunnel for remote access.'
		},
		{
			value: 'local',
			title: 'Local hosting',
			description:
				'Run the Ultramarine Dashboard on this server at port 3972. No outbound connection required.'
		},
		{
			value: 'both',
			title: 'Both',
			description: 'Host the dashboard locally and connect to Fyra for global management.'
		}
	];
</script>

<StepLayout
	title="Choose hosting"
	{onBack}
	{onContinue}
	canContinue={hostingChoice !== null}
	continueLabel="Review setup"
>
	<p class="lead">How do you want to access and manage this server?</p>
	<div class="option-list">
		{#each options as opt}
			<label class="option-card" class:selected={hostingChoice === opt.value}>
				<input type="radio" name="hosting" value={opt.value} bind:group={hostingChoice} />
				<div>
					<strong>{opt.title}</strong>
					<span>{opt.description}</span>
				</div>
			</label>
		{/each}
	</div>
</StepLayout>

<style>
	.lead {
		margin: 0 0 1rem;
		color: var(--muted-foreground);
	}
	.option-list {
		display: grid;
		gap: 0.5rem;
	}
	.option-card {
		display: flex;
		gap: 0.75rem;
		align-items: flex-start;
		padding: 0.75rem 1rem;
		border: 1px solid var(--border);
		border-radius: 0.5rem;
		cursor: pointer;
		background: var(--background);
		transition:
			border-color 0.15s,
			background 0.15s;
	}
	.option-card:hover {
		border-color: var(--accent);
	}
	.option-card.selected {
		border-color: var(--accent);
		background: color-mix(in srgb, var(--accent) 8%, transparent);
	}
	.option-card input {
		margin-top: 0.2rem;
		accent-color: var(--accent);
	}
	.option-card div {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}
	.option-card strong {
		font-weight: 600;
	}
	.option-card span {
		font-size: 0.85rem;
		color: var(--muted-foreground);
	}
</style>
