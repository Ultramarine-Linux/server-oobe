<script lang="ts">
	import StepLayout from '$lib/components/StepLayout.svelte';
	import { t } from '$lib/i18n.svelte';
	let status = $state<'not-installed' | 'installing' | 'stopped' | 'running'>('not-installed');
	let { onBack, onContinue }: { onBack: () => void; onContinue: () => void } = $props();
	async function install() {
		status = 'installing';
		await new Promise((resolve) => setTimeout(resolve, 500));
		status = 'running';
	}
</script>

<StepLayout title={t('tetra-title')} {onBack} {onContinue}>
	<div class="panel">
		<div class="status-icon">
			{status === 'running' ? '✓' : status === 'installing' ? '…' : '!'}
		</div>
		<div>
			<h3>
				{status === 'not-installed'
					? t('tetra-not-installed')
					: status === 'installing'
						? t('tetra-installing')
						: status === 'stopped'
							? t('tetra-stopped')
							: t('tetra-running')}
			</h3>
			<p>
				{status === 'running' ? t('tetra-running-description') : t('tetra-not-running-description')}
			</p>
		</div>
	</div>
	{#if status !== 'running'}<button
			class="primary-button"
			type="button"
			onclick={install}
			disabled={status === 'installing'}
			>{status === 'installing'
				? t('installing')
				: status === 'stopped'
					? t('start-tetra')
					: t('install-start-tetra')}</button
		>{:else}<p class="status-note">
			{t('tetra-ready')}
		</p>{/if}
</StepLayout>
