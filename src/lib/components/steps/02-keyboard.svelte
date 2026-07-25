<script lang="ts">
	import StepLayout from '$lib/components/StepLayout.svelte';
	import { t } from '$lib/i18n.svelte';
	import { keyboardLayouts } from '$lib/keyboard-data';
	let search = $state('');
	let layout = $state('us');
	let variant = $state('');
	let { onBack, onContinue }: { onBack: () => void; onContinue: () => void } = $props();
	const commonLayoutOrder = [
		'us',
		'gb',
		'de',
		'fr',
		'es',
		'it',
		'ca',
		'br',
		'pt',
		'ru',
		'jp',
		'kr',
		'nl',
		'se',
		'no',
		'dk',
		'fi',
		'pl'
	];
	const commonLayoutRank = new Map(commonLayoutOrder.map((id, index) => [id, index]));
	let visible = $derived(
		keyboardLayouts
			.filter((item) => `${item.id} ${item.name}`.toLowerCase().includes(search.toLowerCase()))
			.toSorted(
				(left, right) =>
					(commonLayoutRank.get(left.id) ?? commonLayoutOrder.length) -
						(commonLayoutRank.get(right.id) ?? commonLayoutOrder.length) ||
					left.name.localeCompare(right.name)
			)
	);
	let selectedLayout = $derived(
		keyboardLayouts.find((item) => item.id === layout) ?? keyboardLayouts[0]
	);
	function selectLayout(id: string) {
		layout = id;
		variant = keyboardLayouts.find((item) => item.id === id)?.variants[0]?.id ?? '';
	}
</script>

<StepLayout title={t('keyboard-title')} {onBack} {onContinue}>
	<label class="field-label" for="layout-search">{t('keyboard-search-label')}</label>
	<input
		class="text-input"
		id="layout-search"
		bind:value={search}
		placeholder={t('keyboard-search-placeholder')}
	/>
	<div class="split-fields">
		<div>
			<span class="field-label">{t('keyboard-layout-label')}</span>
			<div class="option-list compact">
				{#each visible as item}<button
						class:selected={layout === item.id}
						class="option"
						type="button"
						onclick={() => selectLayout(item.id)}
						><strong>{item.id}</strong><span>{item.name}</span></button
					>{/each}
			</div>
		</div>
		<div>
			<span class="field-label">{t('keyboard-variant-label')}</span>
			<div class="option-list compact" role="radiogroup" aria-label="Keyboard variants">
				{#each selectedLayout.variants as item}
					<button
						class:selected={variant === item.id}
						class="option"
						type="button"
						role="radio"
						aria-checked={variant === item.id}
						onclick={() => (variant = item.id)}
					>
						{item.name}
					</button>
				{/each}
			</div>
		</div>
	</div>
</StepLayout>
