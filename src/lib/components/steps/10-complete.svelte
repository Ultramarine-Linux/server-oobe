<script lang="ts">
	import StepLayout from '$lib/components/StepLayout.svelte';
	import { t } from '$lib/i18n.svelte';
	import type { HostingChoice } from '$lib/oobe-state';
	let {
		onBack,
		onContinue,
		onReboot,
		onShutdown,
		hostname = 'ultramarine-server',
		administrator = 'Not configured',
		hostingChoice
	}: {
		onBack: () => void;
		onContinue: () => void;
		onReboot: () => void;
		onShutdown: () => void;
		hostname?: string;
		administrator?: string;
		hostingChoice?: HostingChoice | null;
	} = $props();

	function hostingLabel(choice: HostingChoice | null | undefined): string {
		switch (choice) {
			case 'global':
				return t('complete-hosting-global');
			case 'local':
				return t('complete-hosting-local');
			case 'both':
				return t('complete-hosting-both');
			default:
				return t('complete-dashboard-value');
		}
	}

	let continueKey = $derived(
		hostingChoice === 'local' || hostingChoice === 'both' ? 'go-to-dashboard' : 'finish'
	);
</script>

<StepLayout title={t('complete-title')} {onBack} {onContinue} {continueKey}>
	<div class="summary-grid">
		<div><span>{t('complete-hostname')}</span><strong>{hostname}</strong></div>
		<div><span>{t('complete-administrator')}</span><strong>{administrator}</strong></div>
		<div><span>{t('complete-tetra')}</span><strong>{t('complete-tetra-value')}</strong></div>
		<div>
			<span>{t('complete-dashboard')}</span><strong>{hostingLabel(hostingChoice)}</strong>
		</div>
	</div>
	<div class="panel">
		<div class="status-icon">i</div>
		<div>
			<h3>{t('local-recovery-title')}</h3>
			<p>{t('local-recovery-description')}</p>
		</div>
	</div>
	<div class="complete-actions">
		<button type="button" class="primary-button" onclick={onReboot}>{t('reboot')}</button>
		<button type="button" class="secondary-button" onclick={onShutdown}>{t('shutdown')}</button>
	</div>
</StepLayout>

<style>
	.complete-actions {
		display: flex;
		gap: 0.75rem;
		margin-top: 1rem;
	}
	.complete-actions button {
		flex: 1;
	}
</style>
