<script lang="ts">
	import StepLayout from '$lib/components/StepLayout.svelte';
	import { t } from '$lib/i18n.svelte';
	let status = $state<'unknown' | 'online' | 'offline'>('unknown');
	let checking = $state(false);
	let { onBack, onContinue }: { onBack: () => void; onContinue: () => void } = $props();
	async function check() {
		checking = true;
		await new Promise((resolve) => setTimeout(resolve, 350));
		status = navigator.onLine ? 'online' : 'offline';
		checking = false;
	}
</script>

<StepLayout title={t('internet-title')} {onBack} {onContinue}>
	<div class="panel" class:success-panel={status === 'online'}>
		<div class="status-icon">{status === 'online' ? '✓' : status === 'offline' ? '!' : '…'}</div>
		<div>
			<h3>
				{status === 'online'
					? t('network-ready-title')
					: status === 'offline'
						? t('network-offline-title')
						: t('network-unchecked-title')}
			</h3>
			<p>
				{status === 'offline'
					? t('network-offline-description')
					: t('network-unchecked-description')}
			</p>
		</div>
	</div>
	<div class="inline-actions">
		<button class="secondary-button" type="button" onclick={check} disabled={checking}>
			{checking ? t('checking-connection') : t('check-connection')}
		</button>
		{#if status === 'offline'}
			<button class="secondary-button" type="button">
				{t('open-network-settings')}
			</button>
		{/if}
	</div>
</StepLayout>
