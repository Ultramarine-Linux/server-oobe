<script lang="ts">
	import StepLayout from '$lib/components/StepLayout.svelte';
	import { t } from '$lib/i18n.svelte';
	let advanced = $state(false);
	let defaults = $state(true);
	let automaticUpdates = $state(true);
	let { onBack, onContinue }: { onBack: () => void; onContinue: () => void } = $props();
</script>

<StepLayout title={t('defaults-title')} {onBack} {onContinue}>
	<div class="option-list">
		<label class="toggle-option">
			<span>
				<strong>{t('recommended-defaults')}</strong>
				<small>{t('recommended-defaults-description')}</small>
			</span>
			<input type="checkbox" bind:checked={defaults} />
		</label>
		{#if advanced}
			<label class="toggle-option">
				<span>
					<strong>{t('automatic-updates')}</strong>
					<small>{t('automatic-updates-description')}</small>
				</span>
				<input type="checkbox" bind:checked={automaticUpdates} />
			</label>
		{/if}
	</div>
	<button class="secondary-button" type="button" onclick={() => (advanced = !advanced)}>
		{advanced ? t('show-fewer') : t('show-advanced')}
	</button>
</StepLayout>
