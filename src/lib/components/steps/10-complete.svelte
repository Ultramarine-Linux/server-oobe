<script lang="ts">
	import StepLayout from '$lib/components/StepLayout.svelte';
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
				return 'Remote via Fyra (Cloudflare tunnel)';
			case 'local':
				return 'Local dashboard (port 3972)';
			case 'both':
				return 'Local dashboard + Fyra';
			default:
				return 'Offline or not paired';
		}
	}

	let continueLabel = $derived(
		hostingChoice === 'local' || hostingChoice === 'both' ? 'Go to Dashboard' : 'Finish'
	);
</script>

<StepLayout title="Setup complete" {onBack} {onContinue} {continueLabel}>
	<div class="summary-grid">
		<div><span>Hostname</span><strong>{hostname}</strong></div>
		<div><span>Administrator</span><strong>{administrator}</strong></div>
		<div><span>Tetra</span><strong>Ready for local pairing</strong></div>
		<div>
			<span>Dashboard</span><strong>{hostingLabel(hostingChoice)}</strong>
		</div>
	</div>
	<div class="panel">
		<div class="status-icon">i</div>
		<div>
			<h3>Local recovery stays available</h3>
			<p>
				Keep this local setup path available for recovery even when the global Dashboard cannot be
				reached.
			</p>
		</div>
	</div>
	<div class="complete-actions">
		<button type="button" class="primary-button" onclick={onReboot}>Reboot</button>
		<button type="button" class="secondary-button" onclick={onShutdown}>Shut down</button>
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
