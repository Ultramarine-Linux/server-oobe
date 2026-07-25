<script lang="ts">
	import { t } from '$lib/i18n.svelte';
	import type { OobeStep, StepId } from '$lib/oobe-state';

	let {
		steps,
		selectedStep,
		onSelect
	}: { steps: OobeStep[]; selectedStep: StepId; onSelect: (id: StepId) => void } = $props();
</script>

<nav class="steps-card" aria-label="Setup steps">
	<div class="card-heading">
		<p class="eyebrow">{t('first-run')}</p>
		<h2>{t('get-server-ready')}</h2>
	</div>
	<div class="step-list">
		{#each steps as step, index}
			<button
				class:active={selectedStep === step.id}
				class="step"
				data-step-id={step.id}
				aria-current={selectedStep === step.id ? 'step' : undefined}
				type="button"
				onclick={() => onSelect(step.id)}
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
