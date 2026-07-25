<script lang="ts">
	import StepLayout from '$lib/components/StepLayout.svelte';
	let status = $state<'not-started' | 'pending' | 'authorized'>('not-started');
	let { onBack, onContinue }: { onBack: () => void; onContinue: () => void } = $props();
	function begin() {
		status = 'pending';
	}
</script>

<StepLayout
	title="Connect to Fyra"
	{onBack}
	{onContinue}
	continueLabel={status === 'authorized' ? 'Review setup' : 'Continue offline'}
>
	<div class="panel">
		<div class="status-icon">
			{status === 'authorized' ? '✓' : status === 'pending' ? '…' : '→'}
		</div>
		<div>
			<h3>
				{status === 'not-started'
					? 'Global connection is optional'
					: status === 'pending'
						? 'Waiting for authorization'
						: 'Server authorized'}
			</h3>
			<p>
				{status === 'pending'
					? 'A real local service will open the Fyra device authorization handoff and report the result here.'
					: status === 'authorized'
						? 'The server can now establish its outbound authenticated connection.'
						: 'Continue offline or begin a secure Fyra device authorization flow.'}
			</p>
		</div>
	</div>
	{#if status === 'not-started'}<button class="primary-button" type="button" onclick={begin}
			>Connect to Fyra</button
		>{:else if status === 'pending'}<button
			class="secondary-button"
			type="button"
			onclick={() => (status = 'authorized')}>Use fixture authorization</button
		>{/if}
</StepLayout>
