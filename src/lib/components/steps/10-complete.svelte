<script lang="ts">
	import StepLayout from '$lib/components/StepLayout.svelte';
	let { onBack, onContinue }: { onBack: () => void; onContinue: () => void } = $props();
</script>

<StepLayout
	title="Setup complete"
	description="Your local setup choices are ready. Local recovery remains available, and global Dashboard status is shown only when the backend confirms pairing."
	{onBack}
	{onContinue}
	continueLabel="Finish"
>
	<div class="summary-grid">
		<div><span>Hostname</span><strong>ultramarine-server</strong></div>
		<div><span>Administrator</span><strong>Ready to configure</strong></div>
		<div><span>Tetra</span><strong>Ready for local pairing</strong></div>
		<div><span>Dashboard</span><strong>Offline or not paired</strong></div>
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
</StepLayout>
