<script lang="ts">
	import StepLayout from '$lib/components/StepLayout.svelte';
	const layouts = [
		{ id: 'us', name: 'English (US)', variants: ['Default', 'International'] },
		{ id: 'gb', name: 'English (UK)', variants: ['Default', 'Mac'] },
		{ id: 'de', name: 'German', variants: ['Default', 'Dead keys'] },
		{ id: 'fr', name: 'French', variants: ['Default', 'Bepo'] }
	];
	let search = $state('');
	let layout = $state('us');
	let variant = $state('Default');
	let { onBack, onContinue }: { onBack: () => void; onContinue: () => void } = $props();
	let visible = $derived(
		layouts.filter((item) => `${item.id} ${item.name}`.toLowerCase().includes(search.toLowerCase()))
	);
	let selectedLayout = $derived(layouts.find((item) => item.id === layout) ?? layouts[0]);
	function selectLayout(id: string) {
		layout = id;
		variant = 'Default';
	}
</script>

<StepLayout
	title="Set your keyboard"
	description="Choose a layout and variant. The common US layout is selected when no preference is available."
	{onBack}
	{onContinue}
>
	<label class="field-label" for="layout-search">Search layouts</label><input
		class="text-input"
		id="layout-search"
		bind:value={search}
		placeholder="Search layouts"
	/>
	<div class="split-fields">
		<div>
			<span class="field-label">Layout</span>
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
		<label class="field-label" for="variant"
			>Variant<select class="text-input" id="variant" bind:value={variant}
				>{#each selectedLayout.variants as item}<option>{item}</option>{/each}</select
			></label
		>
	</div>
</StepLayout>
