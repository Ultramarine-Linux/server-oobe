<script lang="ts">
	import moonIcon from '$lib/icons/moon.svg';
	import sunIcon from '$lib/icons/sun.svg';

	let { theme, onToggleTheme }: { theme: 'light' | 'dark'; onToggleTheme: () => void } = $props();
</script>

<header class="topbar">
	<img class="brand-logo" src="/ultramarine-logo.svg" alt="" />
	<div class="brand-copy">
		<p class="eyebrow">Ultramarine Server</p>
		<h1>Server setup</h1>
	</div>
	<span class="local-badge">Local setup</span>
	<button
		class="theme-toggle"
		type="button"
		onclick={onToggleTheme}
		aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
		title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
	>
		<img class="theme-icon theme-icon-moon" src={moonIcon} alt="" aria-hidden="true" />
		<img class="theme-icon theme-icon-sun" src={sunIcon} alt="" aria-hidden="true" />
	</button>
</header>
