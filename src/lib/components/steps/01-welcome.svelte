<script lang="ts">
	import StepLayout from '$lib/components/StepLayout.svelte';
	let { onBack, onContinue }: { onBack: () => void; onContinue: () => void } = $props();
</script>

<StepLayout
	title="Welcome to Ultramarine Server"
	description="Set up this server locally. You can resume setup after a reboot, and local recovery remains available when the global Dashboard is offline."
	{onBack}
	{onContinue}
>
	<div class="panel success-panel">
		<div class="status-icon">✓</div>
		<div>
			<h3>Ready for first run</h3>
			<p>
				We will configure the host, create an administrator, and prepare the local management agent.
			</p>
		</div>
	</div>
</StepLayout>
