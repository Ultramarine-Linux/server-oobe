<script lang="ts">
	import StepLayout from '$lib/components/StepLayout.svelte';
	let status = $state<'not-installed' | 'installing' | 'stopped' | 'running'>('not-installed');
	let { onBack, onContinue }: { onBack: () => void; onContinue: () => void } = $props();
	async function install() {
		status = 'installing';
		await new Promise((resolve) => setTimeout(resolve, 500));
		status = 'running';
	}
</script>

<StepLayout title="Connect Tetra" {onBack} {onContinue}>
	<div class="panel">
		<div class="status-icon">
			{status === 'running' ? '✓' : status === 'installing' ? '…' : '!'}
		</div>
		<div>
			<h3>
				{status === 'not-installed'
					? 'Tetra is not installed'
					: status === 'installing'
						? 'Installing Tetra'
						: status === 'stopped'
							? 'Tetra is installed but stopped'
							: 'Tetra is running and unpaired'}
			</h3>
			<p>
				{status === 'running'
					? 'Host fingerprint and pairing status will appear after the local agent reports them.'
					: 'Start the local agent to prepare this server for Fyra pairing.'}
			</p>
		</div>
	</div>
	{#if status !== 'running'}<button
			class="primary-button"
			type="button"
			onclick={install}
			disabled={status === 'installing'}
			>{status === 'installing'
				? 'Installing…'
				: status === 'stopped'
					? 'Start Tetra'
					: 'Install and start Tetra'}</button
		>{:else}<p class="status-note">
			Local Tetra detected. No token or certificate needs to be copied into the browser.
		</p>{/if}
</StepLayout>
