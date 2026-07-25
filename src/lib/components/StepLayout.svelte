<script lang="ts">
	import StepActions from './StepActions.svelte';
	let {
		eyebrow = 'Step in progress',
		title,
		description,
		children,
		onBack,
		onContinue,
		canContinue = true,
		continueLabel = 'Continue'
	}: {
		eyebrow?: string;
		title: string;
		description: string;
		children: import('svelte').Snippet;
		onBack: () => void;
		onContinue: () => void;
		canContinue?: boolean;
		continueLabel?: string;
	} = $props();
</script>

<div class="workspace-heading">
	<div>
		<p class="eyebrow">{eyebrow}</p>
		<h2>{title}</h2>
	</div>
	<span class="status-pill">Fixture mode</span>
</div>
<div class="step-content">
	<p class="step-description">{description}</p>
	{@render children()}
</div>
<StepActions {onBack} {onContinue} {canContinue} {continueLabel} />
