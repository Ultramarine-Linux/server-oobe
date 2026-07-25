<script lang="ts">
	import StepLayout from '$lib/components/StepLayout.svelte';
	let status = $state<'unknown' | 'online' | 'offline'>('unknown');
	let { onBack, onContinue }: { onBack: () => void; onContinue: () => void } = $props();
	async function check() {
		status = 'unknown';
		await new Promise((resolve) => setTimeout(resolve, 350));
		status = 'offline';
	}
</script>

<StepLayout
	title="Check your internet connection"
	description="Basic local setup works offline. An Internet connection is needed only when you connect this server to Fyra."
	{onBack}
	{onContinue}
>
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
		<button class="secondary-button" type="button" onclick={check} disabled={status === 'unknown'}
			>Check connection</button
		>{#if status === 'offline'}<button class="secondary-button" type="button"
				>Open network settings</button
			>{/if}
	</div>
</StepLayout>
