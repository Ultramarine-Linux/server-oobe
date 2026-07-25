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

<StepLayout title="Check your internet connection" {onBack} {onContinue}>
	<div class="panel" class:success-panel={status === 'online'}>
		<div class="status-icon">{status === 'online' ? '✓' : status === 'offline' ? '!' : '…'}</div>
		<div>
			<h3>
				{status === 'online'
					? 'Network is ready'
					: status === 'offline'
						? 'No Internet connection'
						: 'Network status has not been checked'}
			</h3>
			<p>
				{status === 'offline'
					? 'You can continue setup offline and retry later.'
					: 'The local OOBE service will report interfaces and connectivity here.'}
			</p>
		</div>
	</div>
	<div class="inline-actions">
		<button class="secondary-button" type="button" onclick={check} disabled={checking}
			>{checking ? 'Checking…' : 'Check connection'}</button
		>{#if status === 'offline'}<button class="secondary-button" type="button"
				>Open network settings</button
			>{/if}
	</div>
</StepLayout>
