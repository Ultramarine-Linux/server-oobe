<script lang="ts">
	import { t } from '$lib/i18n.svelte';
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
	function translatedContinueLabel() {
		if (continueLabel === 'Finish') return t('finish');
		if (continueLabel === 'Review setup') return t('review-setup');
		if (continueLabel === 'Continue offline') return t('continue-offline');
		return t('next');
	}
</script>

<div class="actions">
	<button class="secondary-button" type="button" onclick={onBack}>{t('prev')}</button>
	<button class="primary-button" type="button" onclick={onContinue} disabled={!canContinue}
		>{translatedContinueLabel()}</button
	>
</div>
