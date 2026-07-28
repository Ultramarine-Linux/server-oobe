<script lang="ts">
	import checkIcon from '$lib/icons/check-circle.svg';
	import alertIcon from '$lib/icons/alert-circle.svg';
	import StepLayout from '$lib/components/StepLayout.svelte';
	import { t } from '$lib/i18n.svelte';
	let confirmation = $state('');
	let touched = $state(false);
	let { password = $bindable(''), onBack, onContinue } = $props();
	let passwordsMatch = $derived(
		password.length > 0 && confirmation.length > 0 && password === confirmation
	);
	let passwordsMismatch = $derived(
		password.length > 0 && confirmation.length > 0 && password !== confirmation
	);
	let isValid = $derived(password.length >= 8 && passwordsMatch);
	let error = $derived(touched && password.length < 8 ? t('password-too-short') : '');
	function submit() {
		touched = true;
		if (isValid) {
			onContinue();
		}
	}
</script>

<StepLayout title={t('password-title')} {onBack} onContinue={submit} canContinue={isValid}>
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
			aria-describedby="password-status password-error"
		/></label
	>
	{#if passwordsMatch}
		<p class="password-status password-match" id="password-status" role="status">
			<span
				class="password-status-icon"
				style={`--password-status-icon: url("${checkIcon}")`}
				aria-hidden="true"
			></span>
			<span>{t('password-match')}</span>
		</p>
	{:else if passwordsMismatch}
		<p class="password-status password-mismatch" id="password-status" role="status">
			<span
				class="password-status-icon"
				style={`--password-status-icon: url("${alertIcon}")`}
				aria-hidden="true"
			></span>
			<span>{t('password-mismatch')}</span>
		</p>
	{/if}
	{#if error}<p class="field-error" id="password-error">{error}</p>{/if}
</StepLayout>
