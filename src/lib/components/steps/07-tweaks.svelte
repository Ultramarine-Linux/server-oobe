<script lang="ts">
	import StepLayout from '$lib/components/StepLayout.svelte';
	let advanced = $state(false);
	let defaults = $state(true);
	let automaticUpdates = $state(true);
	let { onBack, onContinue }: { onBack: () => void; onContinue: () => void } = $props();
</script>

<StepLayout title="Choose server defaults" {onBack} {onContinue}>
	<div class="option-list">
		<label class="toggle-option"
			><span
				><strong>Recommended server defaults</strong><small
					>Apply the standard Ultramarine Server configuration.</small
				></span
			><input type="checkbox" bind:checked={defaults} /></label
		>{#if advanced}<label class="toggle-option"
				><span
					><strong>Automatic updates</strong><small
						>Keep the host updated according to its configured policy.</small
					></span
				><input type="checkbox" bind:checked={automaticUpdates} /></label
			>{/if}
	</div>
	<button class="secondary-button" type="button" onclick={() => (advanced = !advanced)}
		>{advanced ? 'Show fewer options' : 'Show advanced options'}</button
	>
</StepLayout>
