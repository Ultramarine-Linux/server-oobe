<script lang="ts">
	import Shell from '$lib/components/Shell.svelte';
	import LanguageStep from '$lib/components/steps/00-language.svelte';
	import WelcomeStep from '$lib/components/steps/01-welcome.svelte';
	import KeyboardStep from '$lib/components/steps/02-keyboard.svelte';
	import DeviceNameStep from '$lib/components/steps/03-device-name.svelte';
	import UserStep from '$lib/components/steps/04-user.svelte';
	import PasswordStep from '$lib/components/steps/05-password.svelte';
	import InternetStep from '$lib/components/steps/06-internet.svelte';
	import TweaksStep from '$lib/components/steps/07-tweaks.svelte';
	import TetraStep from '$lib/components/steps/08-tetra.svelte';
	import FyraStep from '$lib/components/steps/09-fyra.svelte';
	import CompleteStep from '$lib/components/steps/10-complete.svelte';
	import { fixtureState, stepIndex, type StepId } from '$lib/oobe-state';

	let selectedStep = $state<StepId>(fixtureState.activeStep);
	const steps = fixtureState.steps;
	let currentIndex = $derived(stepIndex(selectedStep));

	function selectStep(step: StepId) {
		selectedStep = step;
	}
	function back() {
		if (currentIndex > 0) selectedStep = steps[currentIndex - 1].id;
	}
	function next() {
		if (currentIndex < steps.length - 1) selectedStep = steps[currentIndex + 1].id;
	}
</script>

<svelte:head>
	<title>Server setup / Ultramarine Server</title>
	<meta name="description" content="Local first-run setup for an Ultramarine Server host." />
</svelte:head>

<Shell {steps} {selectedStep} onSelect={selectStep}>
	{#if selectedStep === 'welcome'}
		<WelcomeStep onBack={back} onContinue={next} />
	{:else if selectedStep === 'language'}
		<LanguageStep onBack={back} onContinue={next} />
	{:else if selectedStep === 'keyboard'}
		<KeyboardStep onBack={back} onContinue={next} />
	{:else if selectedStep === 'devicename'}
		<DeviceNameStep onBack={back} onContinue={next} />
	{:else if selectedStep === 'whoareyou'}
		<UserStep onBack={back} onContinue={next} />
	{:else if selectedStep === 'password'}
		<PasswordStep onBack={back} onContinue={next} />
	{:else if selectedStep === 'internet'}
		<InternetStep onBack={back} onContinue={next} />
	{:else if selectedStep === 'tweaks'}
		<TweaksStep onBack={back} onContinue={next} />
	{:else if selectedStep === 'tetra'}
		<TetraStep onBack={back} onContinue={next} />
	{:else if selectedStep === 'fyra-dash'}
		<FyraStep onBack={back} onContinue={next} />
	{:else}
		<CompleteStep onBack={back} onContinue={next} />
	{/if}
</Shell>
