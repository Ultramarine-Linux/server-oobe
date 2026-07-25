<script lang="ts">
	let {
		canContinue = true,
		onBack,
		onContinue,
		continueLabel = 'Continue'
	}: {
		canContinue?: boolean;
		onBack: () => void;
		onContinue: () => void;
		continueLabel?: string;
	} = $props();
</script>

<div class="actions">
	<button class="secondary-button" type="button" onclick={onBack}>Back</button>
	<button class="primary-button" type="button" onclick={onContinue} disabled={!canContinue}
		>{continueLabel}</button
	>
</div>
