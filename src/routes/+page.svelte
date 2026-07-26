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
	import { api } from '$lib/oobe-api';
	import { fixtureState, stepIndex, type StepId, type OobeState } from '$lib/oobe-state';

	let oobeState = $state<OobeState>(fixtureState);
	let loaded = $state(false);
	let errorMessage = $state('');
	let operationLoading = $state(false);
	let password = $state('');

	let selectedStep = $derived(oobeState.activeStep);
	let currentIndex = $derived(stepIndex(selectedStep));

	$effect(() => {
		api
			.getState()
			.then((s) => {
				oobeState = s;
				loaded = true;
			})
			.catch((err) => {
				console.error('Failed to load OOBE state:', err);
				errorMessage = String(err);
				loaded = true;
			});
	});

	async function saveActiveStep(step: StepId) {
		try {
			const res = await fetch('/api/oobe/state', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ activeStep: step })
			});
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			oobeState = (await res.json()) as OobeState;
		} catch (err) {
			console.error('Failed to save active step:', err);
		}
	}

	async function callOperation(operation: string, payload?: Record<string, unknown>) {
		operationLoading = true;
		try {
			const res = await api.startOperation(selectedStep, operation, payload);
			operationLoading = false;
			return res;
		} catch (err) {
			operationLoading = false;
			throw err;
		}
	}

	function selectStep(step: StepId) {
		saveActiveStep(step);
	}

	function onBack() {
		if (currentIndex > 0) {
			saveActiveStep(oobeState.steps[currentIndex - 1].id);
		}
	}

	async function patchStepStatus(step: StepId, status: 'complete' | 'failed') {
		try {
			const res = await fetch('/api/oobe/state', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ steps: [{ id: step, status }] })
			});
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			oobeState = (await res.json()) as OobeState;
		} catch (err) {
			console.error('Failed to patch step status:', err);
		}
	}

	async function markCompleted() {
		try {
			const res = await fetch('/api/oobe/state', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ completed: true })
			});
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			oobeState = (await res.json()) as OobeState;
		} catch (err) {
			console.error('Failed to mark completed:', err);
		}
	}

	async function onContinue() {
		if (operationLoading) return;
		errorMessage = '';

		const step = selectedStep;

		// Last step: just mark completed and stop.
		if (currentIndex >= oobeState.steps.length - 1) {
			await markCompleted();
			return;
		}

		operationLoading = true;
		try {
			if (step === 'devicename') {
				if (oobeState.hostname) {
					await callOperation('hostname.apply', { hostname: oobeState.hostname });
				}
			}
			if (step === 'keyboard') {
				await callOperation('keyboard.apply', { layout: 'us' });
			}
			if (step === 'whoareyou') {
				if (oobeState.administrator) {
					await callOperation('user.create', { name: oobeState.administrator });
				}
			}
			if (step === 'password') {
				if (password && oobeState.administrator) {
					await callOperation('password.set', { name: oobeState.administrator, password });
					password = '';
				}
			}
			if (step === 'internet') {
				await callOperation('network.check');
			}
			if (step === 'tweaks') {
				await callOperation('tweaks.apply', { defaults: true, automaticUpdates: true });
			}
			if (step === 'tetra') {
				await callOperation('tetra.start');
			}
			if (step === 'fyra-dash') {
				await callOperation('fyra.begin');
				await markCompleted();
			}

			await api.completeStep(step);
			const nextStep = oobeState.steps[currentIndex + 1].id;
			await saveActiveStep(nextStep);
		} catch (err) {
			errorMessage = String(err);
			await patchStepStatus(step, 'failed');
		} finally {
			operationLoading = false;
		}
	}

	async function onReboot() {
		operationLoading = true;
		try {
			await api.startOperation('complete', 'system.reboot');
		} catch (err) {
			errorMessage = String(err);
		} finally {
			operationLoading = false;
		}
	}

	async function onShutdown() {
		operationLoading = true;
		try {
			await api.startOperation('complete', 'system.poweroff');
		} catch (err) {
			errorMessage = String(err);
		} finally {
			operationLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Server setup / Ultramarine Server</title>
	<meta name="description" content="Local first-run setup for an Ultramarine Server host." />
</svelte:head>

{#if !loaded}
	<div class="loading-screen">
		<p>Loading setup state…</p>
	</div>
{:else}
	{#if errorMessage}
		<div class="global-error" role="alert">
			<p>{errorMessage}</p>
			<button type="button" onclick={() => (errorMessage = '')}>Dismiss</button>
		</div>
	{/if}

	<Shell steps={oobeState.steps} {selectedStep} onSelect={selectStep}>
		{#if selectedStep === 'welcome'}
			<WelcomeStep {onBack} {onContinue} />
		{:else if selectedStep === 'language'}
			<LanguageStep {onBack} {onContinue} />
		{:else if selectedStep === 'keyboard'}
			<KeyboardStep {onBack} {onContinue} />
		{:else if selectedStep === 'devicename'}
			<DeviceNameStep bind:hostname={oobeState.hostname} {onBack} {onContinue} />
		{:else if selectedStep === 'whoareyou'}
			<UserStep bind:username={oobeState.administrator} {onBack} {onContinue} />
		{:else if selectedStep === 'password'}
			<PasswordStep bind:password {onBack} {onContinue} />
		{:else if selectedStep === 'internet'}
			<InternetStep {onBack} {onContinue} />
		{:else if selectedStep === 'tweaks'}
			<TweaksStep {onBack} {onContinue} />
		{:else if selectedStep === 'tetra'}
			<TetraStep {onBack} {onContinue} />
		{:else if selectedStep === 'fyra-dash'}
			<FyraStep {onBack} {onContinue} />
		{:else}
			<CompleteStep
				{onBack}
				{onContinue}
				{onReboot}
				{onShutdown}
				hostname={oobeState.hostname}
				administrator={oobeState.administrator}
			/>
		{/if}
	</Shell>
{/if}

<style>
	.loading-screen {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100vh;
	}
	.global-error {
		position: fixed;
		top: 1rem;
		left: 50%;
		transform: translateX(-50%);
		background: #b91c1c;
		color: white;
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
		z-index: 100;
		display: flex;
		gap: 0.75rem;
		align-items: center;
	}
	.global-error button {
		background: white;
		color: #b91c1c;
		border: none;
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		cursor: pointer;
	}
</style>
