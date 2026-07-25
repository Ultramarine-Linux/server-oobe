<script lang="ts">
	import StepLayout from '$lib/components/StepLayout.svelte';
	import { t } from '$lib/i18n.svelte';
	let password = $state('');
	let confirmation = $state('');
	let touched = $state(false);
	let { onBack, onContinue }: { onBack: () => void; onContinue: () => void } = $props();
	let error = $derived(
		touched && password !== confirmation
			? 'Passwords do not match.'
			: touched && password.length < 8
				? 'Use at least 8 characters.'
				: ''
	);
	function submit() {
		touched = true;
		if (!error && password) {
			password = '';
			confirmation = '';
			onContinue();
		}
	}
</script>

<StepLayout
	title={t('password-title')}
	{onBack}
	onContinue={submit}
	canContinue={password.length > 0 && confirmation.length > 0 && !error}
>
	<label class="field-label" for="password"
		>{t('password-label')}<input
			class="text-input"
			id="password"
			type="password"
			bind:value={password}
			autocomplete="new-password"
		/></label
	>
	<label class="field-label" for="password-confirm"
		>{t('password-confirm-label')}<input
			class="text-input"
			id="password-confirm"
			type="password"
			bind:value={confirmation}
			autocomplete="new-password"
			aria-describedby="password-error"
		/></label
	>
	{#if error}<p class="field-error" id="password-error">{error}</p>{/if}
</StepLayout>
