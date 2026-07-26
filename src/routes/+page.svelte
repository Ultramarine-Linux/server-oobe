<script lang="ts">
	import Shell from '$lib/components/Shell.svelte';
	import WelcomeStep from '$lib/components/steps/01-welcome.svelte';
	import DeviceNameStep from '$lib/components/steps/03-device-name.svelte';
	import UserStep from '$lib/components/steps/04-user.svelte';
	import PasswordStep from '$lib/components/steps/05-password.svelte';
	import InternetStep from '$lib/components/steps/06-internet.svelte';
	import TweaksStep from '$lib/components/steps/07-tweaks.svelte';
	import TetraStep from '$lib/components/steps/08-tetra.svelte';
	import FyraStep from '$lib/components/steps/09-fyra.svelte';
	import CompleteStep from '$lib/components/steps/10-complete.svelte';
	import { api } from '$lib/oobe-api';
	import {
		fixtureState,
		fixtureSteps,
		stepIndex,
		type StepId,
		type OobeState
	} from '$lib/oobe-state';
	import { onMount } from 'svelte';
	import { detectLocale } from '$lib/i18n.svelte';
	import { detectKeyboardLayout } from '$lib/keyboard-detect';

	let oobeState = $state<OobeState>(fixtureState);
	let loaded = $state(false);
	let errorMessage = $state('');
	let operationLoading = $state(false);
	let password = $state('');
	let redirecting = $state(false);

	let selectedStep = $derived(oobeState.activeStep);
	let currentIndex = $derived(stepIndex(selectedStep));

	function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
		return new Promise((resolve, reject) => {
			const timer = setTimeout(() => reject(new Error('Timed out loading state')), ms);
			promise
				.then((v) => {
					clearTimeout(timer);
					resolve(v);
				})
				.catch((err) => {
					clearTimeout(timer);
					reject(err);
				});
		});
	}

	onMount(() => {
		detectLocale();
		oobeState.keyboardLayout = detectKeyboardLayout();
		withTimeout(api.getState(), 5000)
			.then((s) => {
				oobeState = s;
				loaded = true;
			})
			.catch((err) => {
				console.error('Failed to load OOBE state:', err);
				errorMessage = 'Unable to load setup state. Using defaults.';
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
			oobeState = { ...oobeState, activeStep: step };
		}
	}

	async function saveHostingChoice(choice: 'global' | 'local' | 'both') {
		try {
			const res = await fetch('/api/oobe/state', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ hostingChoice: choice })
			});
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			oobeState = (await res.json()) as OobeState;
		} catch (err) {
			console.error('Failed to save hosting choice:', err);
			oobeState = { ...oobeState, hostingChoice: choice };
		}
	}

	async function callOperation(operation: string, payload?: Record<string, unknown>) {
		const res = await api.startOperation(selectedStep, operation, payload);
		if (res.status === 'failed') {
			throw new Error(res.message || 'Operation failed');
		}
		return res;
	}

	function onBack() {
		if (currentIndex > 0) {
			saveActiveStep(fixtureSteps[currentIndex - 1].id);
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
			const updatedSteps = oobeState.steps.map((s) => (s.id === step ? { ...s, status } : s));
			oobeState = { ...oobeState, steps: updatedSteps };
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
			oobeState = { ...oobeState, completed: true };
		}
	}

	async function onContinue() {
		if (operationLoading) return;
		errorMessage = '';

		const step = selectedStep;

		// Last step: finish or hand off to local dashboard.
		if (currentIndex >= fixtureSteps.length - 1) {
			const choice = oobeState.hostingChoice;
			const wantsLocal = choice === 'local' || choice === 'both';
			const wantsGlobal = choice === 'global' || choice === 'both';

			if (wantsLocal || wantsGlobal) {
				operationLoading = true;
				try {
					await markCompleted();
					if (wantsGlobal) {
						await callOperation('cloudflare.install');
						await callOperation('fyra.begin');
					}
					if (wantsLocal) {
						await callOperation('dashboard.install');
						await callOperation('dashboard.handoff');
						redirecting = true;
						await new Promise((resolve) => setTimeout(resolve, 4000));
						window.location.href = '/';
					}
				} catch (err) {
					errorMessage = String(err);
					redirecting = false;
				} finally {
					operationLoading = false;
				}
				return;
			}
			await markCompleted();
			return;
		}

		operationLoading = true;
		try {
			if (step === 'devicename') {
				if (oobeState.hostname) {
					await callOperation('hostname.apply', { hostname: oobeState.hostname });
				}
				if (oobeState.keyboardLayout) {
					try {
						await callOperation('keyboard.apply', { layout: oobeState.keyboardLayout });
					} catch (err) {
						console.error('Failed to apply keyboard layout:', err);
					}
				}
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
				if (oobeState.hostingChoice) {
					await saveHostingChoice(oobeState.hostingChoice);
				}
			}

			await api.completeStep(step);
			// Update local step status so sidebar shows the checkmark immediately
			oobeState.steps = oobeState.steps.map((s) =>
				s.id === step ? { ...s, status: 'complete' as import('$lib/oobe-state').StepStatus } : s
			);
			const nextStep = fixtureSteps[currentIndex + 1]?.id;
			if (nextStep) await saveActiveStep(nextStep);
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
			await callOperation('system.reboot');
		} catch (err) {
			errorMessage = String(err);
		} finally {
			operationLoading = false;
		}
	}

	async function onShutdown() {
		operationLoading = true;
		try {
			await callOperation('system.poweroff');
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
	{#if redirecting}
		<div class="redirect-overlay">
			<p class="redirect-title">Starting dashboard…</p>
			<p class="redirect-sub">You will be redirected automatically.</p>
		</div>
	{:else}
		{#if errorMessage}
			<div class="global-error" role="alert">
				<p>{errorMessage}</p>
				<button type="button" onclick={() => (errorMessage = '')}>Dismiss</button>
			</div>
		{/if}

		<Shell steps={oobeState.steps} {selectedStep} onSelectStep={saveActiveStep}>
			{#if selectedStep === 'welcome'}
				<WelcomeStep {onBack} {onContinue} />
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
				<FyraStep bind:hostingChoice={oobeState.hostingChoice} {onBack} {onContinue} />
			{:else}
				<CompleteStep
					{onBack}
					{onContinue}
					{onReboot}
					{onShutdown}
					hostname={oobeState.hostname}
					administrator={oobeState.administrator}
					hostingChoice={oobeState.hostingChoice}
				/>
			{/if}
		</Shell>
	{/if}
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
	.redirect-overlay {
		position: fixed;
		inset: 0;
		z-index: 200;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		background: var(--background);
		color: var(--foreground);
	}
	.redirect-title {
		font-size: 1.25rem;
		font-weight: 600;
		margin: 0;
	}
	.redirect-sub {
		color: var(--muted-foreground);
		font-size: 0.9rem;
		margin: 0;
	}
</style>
