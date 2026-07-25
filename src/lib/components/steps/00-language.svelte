<script lang="ts">
	import StepLayout from '$lib/components/StepLayout.svelte';
	const languages = [
		['en-US', 'English', 'English'],
		['es-ES', 'Spanish', 'Español'],
		['de-DE', 'German', 'Deutsch'],
		['fr-FR', 'French', 'Français'],
		['ja-JP', 'Japanese', '日本語']
	];
	let search = $state('');
	let selected = $state('en-US');
	let { onBack, onContinue }: { onBack: () => void; onContinue: () => void } = $props();
	let filtered = $derived(
		languages.filter(([locale, name, native]) =>
			`${locale} ${name} ${native}`.toLowerCase().includes(search.toLowerCase())
		)
	);
</script>

<StepLayout
	title="Choose your language"
	description="Search for a display language. The selected locale will be applied by the local setup service."
	{onBack}
	{onContinue}
>
	<label class="field-label" for="language-search">Search languages</label>
	<input
		class="text-input"
		id="language-search"
		bind:value={search}
		placeholder="Search by language or locale"
	/>
	<div class="option-list" role="radiogroup" aria-label="Languages">
		{#each filtered as [locale, name, native]}
			<button
				class:selected={selected === locale}
				class="option"
				type="button"
				role="radio"
				aria-checked={selected === locale}
				onclick={() => (selected = locale)}
				><strong>{name}</strong><span>{native} · {locale}</span></button
			>
		{:else}<p class="empty-message">No languages match your search.</p>{/each}
	</div>
</StepLayout>
