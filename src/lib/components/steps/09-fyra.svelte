<script lang="ts">
	import StepLayout from '$lib/components/StepLayout.svelte';
	import { t } from '$lib/i18n.svelte';
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

	const options: { value: HostingChoice; titleKey: string; descriptionKey: string }[] = [
		{
			value: 'global',
			titleKey: 'hosting-global-title',
			descriptionKey: 'hosting-global-description'
		},
		{
			value: 'local',
			titleKey: 'hosting-local-title',
			descriptionKey: 'hosting-local-description'
		},
		{ value: 'both', titleKey: 'hosting-both-title', descriptionKey: 'hosting-both-description' }
	];
</script>

<StepLayout
	title={t('hosting-title')}
	{onBack}
	{onContinue}
	canContinue={hostingChoice !== null}
	continueKey="review-setup"
>
	<p class="lead">{t('hosting-lead')}</p>
	<div class="option-list">
		{#each options as opt}
			<label class="option-card" class:selected={hostingChoice === opt.value}>
				<input type="radio" name="hosting" value={opt.value} bind:group={hostingChoice} />
				<div>
					<strong>{t(opt.titleKey)}</strong>
					<span>{t(opt.descriptionKey)}</span>
				</div>
			</label>
		{/each}
	</div>
	{#if hostingChoice === 'global' || hostingChoice === 'both'}
		<div class="panel global-prompt">
			<div class="status-icon">i</div>
			<div>
				<h3>{t('hosting-fyra-prompt-title')}</h3>
				<p>{t('hosting-fyra-prompt-description')}</p>
			</div>
		</div>
	{/if}
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
	.global-prompt {
		margin-top: 1rem;
		background: color-mix(in srgb, var(--primary) 10%, transparent);
		border-color: var(--primary);
	}
</style>
