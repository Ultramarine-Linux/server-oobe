<script lang="ts">
	import { t } from '$lib/i18n.svelte';
	import StepActions from './StepActions.svelte';
	let {
		title,
		children,
		onBack,
		onContinue,
		canContinue = true,
		continueLabel = 'Continue'
	}: {
		title: string;
		children: import('svelte').Snippet;
		onBack: () => void;
		onContinue: () => void;
		canContinue?: boolean;
		continueLabel?: string;
	} = $props();
</script>

<div class="workspace-heading">
	<h2>{title}</h2>
	<span class="status-pill">{t('fixture-mode')}</span>
</div>
<div class="step-content">{@render children()}</div>
<StepActions {onBack} {onContinue} {canContinue} {continueLabel} />
