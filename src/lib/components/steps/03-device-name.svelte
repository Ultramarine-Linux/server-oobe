<script lang="ts">
	import StepLayout from '$lib/components/StepLayout.svelte';
	let deviceName = $state('Ultramarine Server');
	let hostname = $state('ultramarine-server');
	let touched = $state(false);
	let { onBack, onContinue }: { onBack: () => void; onContinue: () => void } = $props();
	let hostnameError = $derived(
		touched &&
			!/^(([a-z0-9]|[a-z0-9][a-z0-9-]*[a-z0-9])\.)*[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(hostname)
			? 'Use lowercase letters, numbers, dots, and hyphens without empty labels.'
			: ''
	);
	function derive(value: string) {
		if (!touched) {
			const candidate = value
				.trim()
				.split(/\s+/)[0]
				?.toLowerCase()
				.replace(/[^a-z0-9-]/g, '');
			if (candidate) hostname = candidate;
		}
	}
</script>

<StepLayout
	title="Name your server"
	description="Choose a friendly device name and a valid hostname for local network access."
	{onBack}
	{onContinue}
	canContinue={!hostnameError}
>
	<label class="field-label" for="device-name"
		>Device name<input
			class="text-input"
			id="device-name"
			bind:value={deviceName}
			oninput={() => derive(deviceName)}
		/></label
	>
	<label class="field-label" for="hostname"
		>Hostname<input
			class="text-input"
			id="hostname"
			bind:value={hostname}
			oninput={() => (touched = true)}
			aria-describedby="hostname-error"
		/></label
	>
	{#if hostnameError}<p class="field-error" id="hostname-error">{hostnameError}</p>{/if}
</StepLayout>
