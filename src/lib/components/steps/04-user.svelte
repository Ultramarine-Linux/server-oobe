<script lang="ts">
	import StepLayout from '$lib/components/StepLayout.svelte';
	let fullName = $state('');
	let username = $state('');
	let usernameEdited = $state(false);
	let touched = $state(false);
	let { onBack, onContinue }: { onBack: () => void; onContinue: () => void } = $props();
	let usernameError = $derived(
		touched && !/^[a-z_][a-z0-9_-]*$/.test(username)
			? 'Use a lowercase username beginning with a letter or underscore.'
			: ''
	);
	function updateName(value: string) {
		fullName = value;
		if (!usernameEdited)
			username =
				value
					.trim()
					.split(/\s+/)[0]
					?.toLowerCase()
					.replace(/[^a-z0-9_]/g, '') ?? '';
	}
</script>

<StepLayout
	title="Create your administrator"
	description="This local administrator is used for recovery and host management. The backend will perform the privileged user operation."
	{onBack}
	{onContinue}
	canContinue={Boolean(username) && !usernameError}
>
	<label class="field-label" for="full-name"
		>Full name<input
			class="text-input"
			id="full-name"
			value={fullName}
			oninput={(event) => updateName(event.currentTarget.value)}
		/></label
	>
	<label class="field-label" for="username"
		>Username<input
			class="text-input"
			id="username"
			bind:value={username}
			oninput={() => {
				usernameEdited = true;
				touched = true;
			}}
			aria-describedby="username-error"
		/></label
	>
	{#if usernameError}<p class="field-error" id="username-error">{usernameError}</p>{/if}
</StepLayout>
