<script lang="ts">
	import StepLayout from '$lib/components/StepLayout.svelte';
	import { setLocale, t } from '$lib/i18n.svelte';
	import { supportedLanguages } from '$lib/languages';

	let search = $state('');
	let selected = $state('en-US');
	let { onBack, onContinue }: { onBack: () => void; onContinue: () => void } = $props();
	let filtered = $derived(
		supportedLanguages.filter(({ locale, name, nativeName }) =>
			`${locale} ${name} ${nativeName}`.toLowerCase().includes(search.toLowerCase())
		)
	);
</script>

<StepLayout title={t('language-title')} {onBack} {onContinue}>
	<label class="field-label" for="language-search">{t('language-search-label')}</label>
	<input
		class="text-input"
		id="language-search"
		bind:value={search}
		placeholder={t('language-search-placeholder')}
	/>
	<div class="option-list" role="radiogroup" aria-label={t('language-group-label')}>
		{#each filtered as language}
			<button
				class:selected={selected === language.locale}
				class="option"
				type="button"
				role="radio"
				aria-checked={selected === language.locale}
				onclick={() => {
					selected = language.locale;
					setLocale(language.locale);
				}}
			>
				<strong>{language.name}</strong><span>{language.nativeName} · {language.locale}</span>
			</button>
		{:else}
			<p class="empty-message">{t('language-empty')}</p>
		{/each}
	</div>
</StepLayout>
